/**
 * Health Metrics Routes
 */

import express from 'express';
import * as healthMetricsController from '../controllers/health-metrics.controller.mjs';

const router = express.Router();

// GET /api/health-metrics - Get available metrics
router.get('/', healthMetricsController.getAvailableMetrics);

// GET /api/health-metrics/:metric - Get health metrics data as GeoJSON
router.get('/:metric', healthMetricsController.getHealthMetrics);

// GET /api/health-metrics/:metric/filters - Get unique filter values
router.get('/:metric/filters', healthMetricsController.getMetricFilters);

export default router;
