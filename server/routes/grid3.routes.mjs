import express from 'express';
import pool from '../config/database.config.mjs';

const router = express.Router();

/**
 * GET /api/grid3/population
 * Returns LGA-level population data from GRID3
 */
router.get('/population', async (req, res) => {
  try {
    const query = `
      SELECT 
        shortname as lga_name,
        year,
        total_population,
        male_population,
        female_population,
        ST_AsGeoJSON(geom)::json as geometry
      FROM grid3_processed.population_lga
      WHERE year = (SELECT MAX(year) FROM grid3_processed.population_lga)
      ORDER BY shortname
    `;
    
    const result = await pool.query(query);
    
    // Convert to GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        properties: {
          lga_name: row.lga_name,
          year: row.year,
          total_population: row.total_population,
          male_population: row.male_population,
          female_population: row.female_population,
          population_density: row.total_population // Can be enhanced with area calculation
        },
        geometry: row.geometry
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching GRID3 population:', error);
    res.status(500).json({ error: 'Failed to fetch population data' });
  }
});

/**
 * GET /api/grid3/settlements
 * Returns settlement data from GRID3 (if available)
 */
router.get('/settlements', async (req, res) => {
  try {
    // Check if settlements table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'grid3_processed' 
        AND table_name = 'settlements'
      )
    `);
    
    if (!checkTable.rows[0].exists) {
      return res.json({
        type: 'FeatureCollection',
        features: [],
        message: 'Settlements data not yet available'
      });
    }
    
    const query = `
      SELECT 
        settlement_name,
        settlement_type,
        population,
        ST_AsGeoJSON(geom)::json as geometry
      FROM grid3_processed.settlements
      WHERE state_name = 'Anambra'
      LIMIT 1000
    `;
    
    const result = await pool.query(query);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        properties: {
          name: row.settlement_name,
          type: row.settlement_type,
          population: row.population
        },
        geometry: row.geometry
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching GRID3 settlements:', error);
    res.json({
      type: 'FeatureCollection',
      features: [],
      error: error.message
    });
  }
});

/**
 * GET /api/grid3/facilities-access
 * Returns facility accessibility data (travel time to nearest facility)
 */
router.get('/facilities-access', async (req, res) => {
  try {
    // Check if facility access table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'grid3_processed' 
        AND table_name = 'facility_access'
      )
    `);
    
    if (!checkTable.rows[0].exists) {
      return res.json({
        type: 'FeatureCollection',
        features: [],
        message: 'Facility access data not yet available'
      });
    }
    
    const query = `
      SELECT 
        lga_name,
        avg_travel_time_minutes,
        facilities_count,
        coverage_ratio,
        ST_AsGeoJSON(geom)::json as geometry
      FROM grid3_processed.facility_access
      ORDER BY lga_name
    `;
    
    const result = await pool.query(query);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        properties: {
          lga_name: row.lga_name,
          avg_travel_time: row.avg_travel_time_minutes,
          facilities_count: row.facilities_count,
          coverage_ratio: row.coverage_ratio
        },
        geometry: row.geometry
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching facility access:', error);
    res.json({
      type: 'FeatureCollection',
      features: [],
      error: error.message
    });
  }
});

/**
 * GET /api/grid3/indicators
 * Returns available GRID3 indicator layers
 */
router.get('/indicators', async (req, res) => {
  try {
    const indicators = [
      {
        id: 'population',
        name: 'Population Density',
        description: 'LGA-level population from GRID3',
        available: true,
        endpoint: '/api/grid3/population'
      },
      {
        id: 'settlements',
        name: 'Settlement Types',
        description: 'Urban/rural settlement classification',
        available: false,
        endpoint: '/api/grid3/settlements'
      },
      {
        id: 'facility_access',
        name: 'Facility Access',
        description: 'Travel time to nearest health facility',
        available: false,
        endpoint: '/api/grid3/facilities-access'
      }
    ];
    
    res.json(indicators);
  } catch (error) {
    console.error('Error listing indicators:', error);
    res.status(500).json({ error: 'Failed to list indicators' });
  }
});

export default router;
