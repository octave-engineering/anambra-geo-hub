/**
 * Health Metrics Controller
 * Handles health metrics data retrieval and transformation
 */

import pool from '../config/database.config.mjs';
import { HEALTH_METRICS, isValidMetric, getMetricConfig, getAllMetrics } from '../config/metrics.config.mjs';
import { config } from '../config/app.config.mjs';

/**
 * Get health metrics data as GeoJSON
 */
export const getHealthMetrics = async (req, res, next) => {
  try {
    const { metric } = req.params;
    const { lga, ward, period, limit = config.api.defaultLimit } = req.query;

    // Validate metric
    if (!isValidMetric(metric)) {
      return res.status(400).json({ 
        error: 'Invalid metric', 
        available: Object.keys(HEALTH_METRICS) 
      });
    }

    const metricConfig = getMetricConfig(metric);
    
    // Build query
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
    
    // Enforce max limit
    const finalLimit = Math.min(parseInt(limit), config.api.maxLimit);
    params.push(finalLimit);
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
    next(error);
  }
};

/**
 * Get available metrics
 */
export const getAvailableMetrics = async (req, res, next) => {
  try {
    res.json({
      metrics: getAllMetrics()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unique filter values for a metric
 */
export const getMetricFilters = async (req, res, next) => {
  try {
    const { metric } = req.params;
    
    if (!isValidMetric(metric)) {
      return res.status(400).json({ 
        error: 'Invalid metric', 
        available: Object.keys(HEALTH_METRICS) 
      });
    }
    
    const metricConfig = getMetricConfig(metric);
    
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
    next(error);
  }
};
