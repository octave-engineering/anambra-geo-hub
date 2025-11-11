/**
 * Gemini AI Routes
 */

import express from 'express';
import * as geminiController from '../controllers/gemini.controller.mjs';

const router = express.Router();

// GET /api/health - Health check
router.get('/health', geminiController.healthCheck);

// POST /api/generate - Generate content using Gemini
router.post('/generate', geminiController.generateContent);

export default router;
