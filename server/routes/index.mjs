/**
 * API Routes Index
 * Combines all route modules
 */

import express from 'express';
import facilitiesRoutes from './facilities.routes.mjs';
import healthMetricsRoutes from './health-metrics.routes.mjs';
import geminiRoutes from './gemini.routes.mjs';

const router = express.Router();

// Mount route modules
router.use('/facilities', facilitiesRoutes);
router.use('/lgas', facilitiesRoutes); // Legacy support
router.use('/wards', facilitiesRoutes); // Legacy support
router.use('/stats', facilitiesRoutes); // Legacy support
router.use('/health-metrics', healthMetricsRoutes);
router.use('/', geminiRoutes); // Health and generate endpoints

export default router;
