import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pg from 'pg';

const { Pool } = pg;

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'anambra_health',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10 seconds for AWS RDS (was 2000ms - too short!)
});

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const apiVersion = (process.env.GEMINI_API_VERSION || 'v1').toLowerCase();
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY not set. Set it in .env');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey, { apiVersion }) : null;

// Pick a reasonable default model; allow override via env or request body
const DEFAULT_MODEL = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash-001';

// ============ DATABASE API ENDPOINTS ============

// Get all facilities with optional filtering (returns GeoJSON)
app.get('/api/facilities', async (req, res) => {
  try {
    const { lga, ward, facility_type, search } = req.query;
    
    let query = `
      SELECT 
        facility_id,
        facility_name,
        lga_id,
        lga_name,
        ward_id,
        ward_name,
        ST_AsGeoJSON(geom)::json as geometry,
        ST_X(geom) as longitude,
        ST_Y(geom) as latitude
      FROM phc_facility
      WHERE geom IS NOT NULL
    `;
    
    const params = [];
    
    // Apply LGA filter
    if (lga) {
      params.push(lga);
      query += ` AND lga_name ILIKE $${params.length}`;
    }
    
    // Apply Ward filter
    if (ward) {
      params.push(ward);
      query += ` AND ward_name ILIKE $${params.length}`;
    }
    
    // Apply facility type filter (searches in facility name)
    if (facility_type) {
      params.push(`%${facility_type}%`);
      query += ` AND facility_name ILIKE $${params.length}`;
    }
    
    // Apply search filter
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (facility_name ILIKE $${params.length} OR lga_name ILIKE $${params.length} OR ward_name ILIKE $${params.length})`;
    }
    
    query += ` ORDER BY facility_name`;
    
    const result = await pool.query(query, params);
    
    // Convert to GeoJSON format
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
          facility_id: row.facility_id,
          facility_name: row.facility_name,
          lga_id: row.lga_id,
          lga_name: row.lga_name,
          ward_id: row.ward_id,
          ward_name: row.ward_name,
          longitude: row.longitude,
          latitude: row.latitude
        }
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Failed to fetch facilities', details: error.message });
  }
});

// Get unique LGAs
app.get('/api/lgas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT lga_id, lga_name 
      FROM phc_facility 
      WHERE lga_name IS NOT NULL 
      ORDER BY lga_name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching LGAs:', error);
    res.status(500).json({ error: 'Failed to fetch LGAs', details: error.message });
  }
});

// Get wards by LGA
app.get('/api/wards', async (req, res) => {
  try {
    const { lga } = req.query;
    
    let query = `
      SELECT DISTINCT ward_id, ward_name, lga_name 
      FROM phc_facility 
      WHERE ward_name IS NOT NULL
    `;
    
    const params = [];
    if (lga) {
      params.push(lga);
      query += ` AND lga_name ILIKE $${params.length}`;
    }
    
    query += ` ORDER BY ward_name`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({ error: 'Failed to fetch wards', details: error.message });
  }
});

// Get facility statistics
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_facilities,
        COUNT(DISTINCT lga_name) as total_lgas,
        COUNT(DISTINCT ward_name) as total_wards,
        COUNT(CASE WHEN geom IS NOT NULL THEN 1 END) as facilities_with_coords
      FROM phc_facility
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message });
  }
});

// ============ GEMINI API ENDPOINTS ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, model: DEFAULT_MODEL, hasKey: Boolean(apiKey), apiVersion });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model, parts } = req.body || {};

    if (!genAI) {
      return res.status(500).json({ error: 'Server not configured with GEMINI_API_KEY' });
    }

    const modelId = model || DEFAULT_MODEL;
    const gm = genAI.getGenerativeModel({ model: modelId });

    // Support either a simple text prompt or multimodal parts array
    let result;
    if (Array.isArray(parts) && parts.length > 0) {
      result = await gm.generateContent(parts);
    } else if (typeof prompt === 'string' && prompt.trim()) {
      result = await gm.generateContent(prompt);
    } else {
      return res.status(400).json({ error: 'Provide a text prompt or a parts array.' });
    }

    const text = result?.response?.text?.() || '';
    res.json({ text, model: modelId });
  } catch (err) {
    console.error('Gemini server error:', err);
    const message = err?.response?.data || err?.message || 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini server listening on http://localhost:${PORT}`);
});
