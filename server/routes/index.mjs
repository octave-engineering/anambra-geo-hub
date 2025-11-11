/**
 * API Routes Index
 * Combines all route modules
 */

import express from 'express';
import facilitiesRoutes from './facilities.routes.mjs';
import healthMetricsRoutes from './health-metrics.routes.mjs';
import geminiRoutes from './gemini.routes.mjs';
import authRoutes from './auth.routes.mjs';
import requireAuth from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Mount route modules
router.use('/auth', authRoutes);

// Protect sensitive data endpoints
router.use('/facilities', requireAuth, facilitiesRoutes);
router.use('/lgas', requireAuth, facilitiesRoutes); // Legacy support
router.use('/wards', requireAuth, facilitiesRoutes); // Legacy support
router.use('/stats', requireAuth, facilitiesRoutes); // Legacy support
router.use('/health-metrics', requireAuth, healthMetricsRoutes);
router.use('/', geminiRoutes); // Health and generate endpoints

export default router;
