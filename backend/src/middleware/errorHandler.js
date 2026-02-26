const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = 'Invalid JSON in request body';
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  logger.error(err.message, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
