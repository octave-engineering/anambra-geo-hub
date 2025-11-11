/**
 * Auth Middleware (API Key + JWT)
 */

import jwt from 'jsonwebtoken';

const getApiKeys = () => {
  const raw = process.env.API_KEYS || process.env.AUTH_API_KEYS || '';
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
};

export const isAuthEnabled = () =>
  String(process.env.AUTH_ENABLED || 'false').toLowerCase() === 'true';

export const issueToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET || 'change-me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '12h';
  return jwt.sign(payload, secret, { expiresIn, ...options });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'change-me';
  return jwt.verify(token, secret);
};

const extractHeaders = (req) => {
  const auth = req.headers['authorization'] || '';
  const apiKey = req.headers['x-api-key'] || '';
  return { auth: String(auth), apiKey: String(apiKey) };
};

export const requireAuth = (req, res, next) => {
  if (!isAuthEnabled()) return next();

  const { auth, apiKey } = extractHeaders(req);
  const keys = getApiKeys();

  // API Key via x-api-key
  if (apiKey && keys.includes(apiKey)) return next();

  // API Key via Authorization: ApiKey <key> or Bearer <key>
  if (auth.startsWith('ApiKey ')) {
    const provided = auth.slice('ApiKey '.length).trim();
    if (keys.includes(provided)) return next();
  }
  if (auth.startsWith('Bearer ')) {
    const token = auth.slice('Bearer '.length).trim();
    // Accept API key in Bearer form
    if (keys.includes(token)) return next();

    // Otherwise treat as JWT
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  return res.status(401).json({ error: 'Unauthorized' });
};

export default requireAuth;
