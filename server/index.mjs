import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pg from 'pg';
import authRoutes from './routes/auth.routes.mjs';

const { Pool } = pg;

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS configuration for production
// Parse CORS origins - handle wildcard properly
let corsOrigins;
if (process.env.CORS_ORIGIN === '*') {
  corsOrigins = '*';
} else if (process.env.CORS_ORIGIN) {
  corsOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
} else {
  corsOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'];
}

console.log('🔧 CORS Origins:', corsOrigins);

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'x-api-key'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

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

// ============ API ROUTES ============

// Mount auth routes
app.use('/api/auth', authRoutes);

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

// ============ HEALTH METRICS API ENDPOINTS ============

// Metric configuration mapping
const HEALTH_METRICS = {
  'severe_malaria': {
    table: 'dhis_severe_malaria_cases',
    view: 'vw_severe_malaria_cases',
    name: 'Severe Malaria Cases',
    description: 'Cases of severe malaria reported by health facilities'
  },
  'sickle_cell': {
    table: 'dhis_sickle_cell_cases',
    view: 'vw_sickle_cell_disease',
    name: 'Sickle Cell Cases',
    description: 'Sickle cell disease cases reported by health facilities'
  },
  'breast_cancer': {
    table: 'dhis_breast_cancer_cases',
    view: 'vw_breast_cancer_cases',
    name: 'Breast Cancer Cases',
    description: 'Breast cancer cases reported by health facilities'
  },
  'death_cases': {
    table: 'dhis_death_cases',
    view: 'vw_death_cases',
    name: 'Death Cases',
    description: 'Death cases reported by health facilities'
  }
};

// Get health metrics data as GeoJSON
app.get('/api/health-metrics/:metric', async (req, res) => {
  try {
    const { metric } = req.params;
    const { lga, ward, period, limit = 10000 } = req.query;

    // Validate metric
    if (!HEALTH_METRICS[metric]) {
      return res.status(400).json({ 
        error: 'Invalid metric', 
        available: Object.keys(HEALTH_METRICS) 
      });
    }

    const metricConfig = HEALTH_METRICS[metric];
    
    // Build query - try view first, fallback to table
    // Note: Adjust table/view names based on your actual database schema
    let query = `
      SELECT 
        fact_record_id,
        dataset_uid,
        dataelement_uid,
        dataelement_name,
        period,
        CAST(case_count AS FLOAT) as case_count,
        facility_id,
        facility_name,
        lga_id,
        lga_name,
        lastupdated,
        facility_name_dim,
        parentlganame,
        parentwardname,
        ST_AsGeoJSON(geom)::json as geometry,
        ST_X(geom) as longitude,
        ST_Y(geom) as latitude
      FROM ${metricConfig.view}
      WHERE geom IS NOT NULL
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Apply filters
    if (lga) {
      params.push(lga);
      query += ` AND lga_name ILIKE $${paramIndex++}`;
    }
    
    if (ward) {
      params.push(ward);
      query += ` AND parentwardname ILIKE $${paramIndex++}`;
    }
    
    if (period) {
      params.push(period);
      query += ` AND period = $${paramIndex++}`;
    }
    
    // Add ordering and limit
    query += ` ORDER BY period DESC, facility_name`;
    params.push(limit);
    query += ` LIMIT $${paramIndex++}`;
    
    const result = await pool.query(query, params);
    
    // Convert to GeoJSON FeatureCollection
    const geojson = {
      type: 'FeatureCollection',
      name: metricConfig.name,
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
      },
      metadata: {
        metric: metric,
        description: metricConfig.description,
        count: result.rows.length,
        filters: { lga, ward, period }
      },
      features: result.rows.map(row => ({
        type: 'Feature',
        properties: {
          fact_record_id: row.fact_record_id,
          dataset_uid: row.dataset_uid,
          dataelement_uid: row.dataelement_uid,
          dataelement_name: row.dataelement_name,
          period: row.period,
          case_count: row.case_count,
          facility_id: row.facility_id,
          facility_name: row.facility_name,
          lga_id: row.lga_id,
          lga_name: row.lga_name,
          lastupdated: row.lastupdated,
          facility_name_dim: row.facility_name_dim,
          parentlganame: row.parentlganame,
          parentwardname: row.parentwardname,
          longitude: row.longitude,
          latitude: row.latitude
        },
        geometry: row.geometry
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch health metrics', 
      details: error.message 
    });
  }
});

// Get available metrics
app.get('/api/health-metrics', async (req, res) => {
  res.json({
    metrics: Object.entries(HEALTH_METRICS).map(([id, config]) => ({
      id,
      name: config.name,
      description: config.description
    }))
  });
});

// Get unique filter values for a metric
app.get('/api/health-metrics/:metric/filters', async (req, res) => {
  try {
    const { metric } = req.params;
    
    if (!HEALTH_METRICS[metric]) {
      return res.status(400).json({ 
        error: 'Invalid metric', 
        available: Object.keys(HEALTH_METRICS) 
      });
    }
    
    const metricConfig = HEALTH_METRICS[metric];
    
    const query = `
      SELECT 
        array_agg(DISTINCT lga_name ORDER BY lga_name) FILTER (WHERE lga_name IS NOT NULL) as lgas,
        array_agg(DISTINCT parentwardname ORDER BY parentwardname) FILTER (WHERE parentwardname IS NOT NULL) as wards,
        array_agg(DISTINCT period ORDER BY period DESC) FILTER (WHERE period IS NOT NULL) as periods
      FROM ${metricConfig.view}
    `;
    
    const result = await pool.query(query);
    
    res.json({
      metric,
      lgas: result.rows[0].lgas || [],
      wards: result.rows[0].wards || [],
      periods: result.rows[0].periods || []
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ 
      error: 'Failed to fetch filter options', 
      details: error.message 
    });
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
