/**
 * Admin Routes
 * Endpoints for administrative actions (user approvals, etc.)
 */

import express from 'express';
import { listPendingUsers, approveUser } from '../controllers/auth.controller.mjs';

const router = express.Router();

// GET /api/admin/pending-users - list users whose accounts are not yet active
router.get('/pending-users', listPendingUsers);

// POST /api/admin/users/:id/approve - activate a user account
router.post('/users/:id/approve', approveUser);

export default router;
