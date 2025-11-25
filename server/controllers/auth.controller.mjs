/**
 * Auth Controller
 * - Database user authentication
 * - JWT token management
 */

import bcrypt from 'bcrypt';
import { pool } from '../config/database.config.mjs';
import { issueToken, isAuthEnabled } from '../middleware/auth.middleware.mjs';

const getApiKeys = () => {
  const raw = process.env.API_KEYS || process.env.AUTH_API_KEYS || '';
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
};

const validateUserCredentials = async (username, password) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = $1 AND is_active = true',
      [username]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return null;
    }
    
    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Database auth error:', error);
    return null;
  }
};

export const login = async (req, res) => {
  try {
    if (!isAuthEnabled()) {
      return res.status(200).json({ ok: true, message: 'Auth disabled', token: null });
    }

    const { username, password, apiKey } = req.body || {};

    // Accept API key directly to get a short-lived JWT
    if (apiKey) {
      const keys = getApiKeys();
      if (!keys.includes(String(apiKey))) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      const token = issueToken({ sub: 'api-key', scope: 'read', type: 'api' });
      return res.json({ ok: true, token, type: 'api-key' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const user = await validateUserCredentials(String(username), String(password));
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken({ 
      sub: user.id, 
      username: user.username,
      email: user.email,
      role: user.role,
      type: 'user'
    });
    
    return res.json({ 
      ok: true, 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      type: 'user' 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

export const me = async (req, res) => {
  try {
    // If request reached here, it's authorized (API key or JWT)
    const user = req.user || { sub: 'api-key' };
    
    // If it's a user JWT, fetch fresh user data
    if (user.type === 'user' && user.sub) {
      const result = await pool.query(
        'SELECT id, username, email, role, is_active, last_login FROM users WHERE id = $1 AND is_active = true',
        [user.sub]
      );
      
      if (result.rows.length > 0) {
        const dbUser = result.rows[0];
        return res.json({ 
          ok: true, 
          user: {
            id: dbUser.id,
            username: dbUser.username,
            email: dbUser.email,
            role: dbUser.role,
            lastLogin: dbUser.last_login
          }
        });
      }
    }
    
    return res.json({ ok: true, user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ error: 'Failed to get user info' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body || {};
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }

    const allowedRoles = ['admin', 'partner', 'user'];
    const requestedRole = allowedRoles.includes(role) ? role : 'user';
    const requiresApproval = requestedRole === 'admin' || requestedRole === 'partner';
    const isActive = !requiresApproval;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, is_active',
      [username, email, passwordHash, requestedRole, isActive]
    );
    
    const newUser = result.rows[0];

    const message = requiresApproval
      ? 'Account request submitted. An administrator must approve your access before you can log in.'
      : 'User created successfully';
    
    return res.status(201).json({ 
      ok: true, 
      message,
      pendingApproval: requiresApproval,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.is_active
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
};
