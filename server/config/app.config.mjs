/**
 * Application Configuration
 * Environment variables and app settings
 */

import 'dotenv/config';

export const config = {
  // Server settings
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database settings
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'anambra_health',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  
  // Gemini API settings
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
    apiVersion: (process.env.GEMINI_API_VERSION || 'v1').toLowerCase(),
    defaultModel: process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash-001',
  },
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  },
  
  // API settings
  api: {
    defaultLimit: 10000,
    maxLimit: 50000,
  }
};

export default config;
