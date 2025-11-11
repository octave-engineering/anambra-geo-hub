/**
 * Database Configuration
 * PostgreSQL/PostGIS connection settings
 */

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Database connection pool
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'anambra_health',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Connection event handlers
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✓ Database connection test successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('✗ Database connection test failed:', error.message);
    return false;
  }
};

export default pool;
