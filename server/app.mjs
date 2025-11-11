/**
 * Anambra Health GeoHub API Server
 * Main application entry point
 */

import express from 'express';
import { config } from './config/app.config.mjs';
import { testConnection } from './config/database.config.mjs';
import corsMiddleware from './middleware/cors.middleware.mjs';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.mjs';
import apiRoutes from './routes/index.mjs';

const app = express();

// ============ MIDDLEWARE ============
app.use(express.json({ limit: '10mb' }));
app.use(corsMiddleware);

// Request logging (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============ API ROUTES ============
app.use('/api', apiRoutes);

// ============ ERROR HANDLING ============
app.use(notFoundHandler);
app.use(errorHandler);

// ============ SERVER STARTUP ============
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(config.port, () => {
      console.log('');
      console.log('========================================');
      console.log('  Anambra Health GeoHub API Server');
      console.log('========================================');
      console.log(`  Environment: ${config.nodeEnv}`);
      console.log(`  Port: ${config.port}`);
      console.log(`  Database: ${config.database.name}`);
      console.log(`  Server: http://localhost:${config.port}`);
      console.log('========================================');
      console.log('');
      console.log('Available endpoints:');
      console.log('  GET  /api/health');
      console.log('  GET  /api/facilities');
      console.log('  GET  /api/lgas');
      console.log('  GET  /api/wards');
      console.log('  GET  /api/stats');
      console.log('  GET  /api/health-metrics');
      console.log('  GET  /api/health-metrics/:metric');
      console.log('  GET  /api/health-metrics/:metric/filters');
      console.log('  POST /api/generate');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
