/**
 * Auth Routes
 */

import express from 'express';
import { login, me, register } from '../controllers/auth.controller.mjs';
import requireAuth from '../middleware/auth.middleware.mjs';

const router = express.Router();

// POST /api/auth/login - obtain JWT using username/password or API key
router.post('/login', login);

// POST /api/auth/register - create new user account
router.post('/register', register);

// GET /api/auth/me - returns current user (requires auth)
router.get('/me', requireAuth, me);

export default router;
