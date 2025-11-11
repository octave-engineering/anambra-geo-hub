/**
 * Auth Controller
 * - API Key auth
 * - Username/Password -> JWT
 */

import { issueToken, isAuthEnabled } from '../middleware/auth.middleware.mjs';

const getApiKeys = () => {
  const raw = process.env.API_KEYS || process.env.AUTH_API_KEYS || '';
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
};

const isValidCredentials = (username, password) => {
  const u = process.env.AUTH_USERNAME || '';
  const p = process.env.AUTH_PASSWORD || '';
  return Boolean(u && p && username === u && password === p);
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
      const token = issueToken({ sub: 'api-key', scope: 'read' });
      return res.json({ ok: true, token, type: 'api-key' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    if (!isValidCredentials(String(username), String(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken({ sub: String(username), scope: 'read' });
    return res.json({ ok: true, token, type: 'user' });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
};

export const me = async (req, res) => {
  // If request reached here, it's authorized (API key or JWT)
  return res.json({ ok: true, user: req.user || { sub: 'api-key' } });
};
