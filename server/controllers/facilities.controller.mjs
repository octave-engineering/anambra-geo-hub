/**
 * Facilities Controller
 * Handles facility-related business logic
 */

import pool from '../config/database.config.mjs';

/**
 * Get all facilities with optional filtering (returns GeoJSON)
 */
export const getFacilities = async (req, res, next) => {
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
    
    // Apply facility type filter
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
    next(error);
  }
};

/**
 * Get unique LGAs
 */
export const getLGAs = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT id AS lga_id, shortname AS lga_name
      FROM dim_lga
      WHERE shortname IS NOT NULL
      ORDER BY shortname
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Get wards by LGA
 */
export const getWards = async (req, res, next) => {
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
    next(error);
  }
};

/**
 * Get facility statistics
 */
export const getStats = async (req, res, next) => {
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
    next(error);
  }
};
