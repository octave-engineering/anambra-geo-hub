/**
 * Error Handling Middleware
 */

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    timestamp: new Date().toISOString()
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/facilities',
      'GET /api/lgas',
      'GET /api/wards',
      'GET /api/stats',
      'GET /api/health-metrics',
      'GET /api/health-metrics/:metric',
      'GET /api/health-metrics/:metric/filters',
      'POST /api/generate'
    ]
  });
};

export default { errorHandler, notFoundHandler };
