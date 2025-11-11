/**
 * Facilities Routes
 */

import express from 'express';
import * as facilitiesController from '../controllers/facilities.controller.mjs';

const router = express.Router();

// GET /api/facilities - Get all facilities with optional filtering
router.get('/', facilitiesController.getFacilities);

// GET /api/lgas - Get unique LGAs
router.get('/lgas', facilitiesController.getLGAs);

// GET /api/wards - Get wards by LGA
router.get('/wards', facilitiesController.getWards);

// GET /api/stats - Get facility statistics
router.get('/stats', facilitiesController.getStats);

export default router;
