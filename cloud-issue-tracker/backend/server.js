require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const issueRoutes = require('./routes/issues');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins
}));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// Friendly root route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Cloud Issue Tracker API',
    endpoints: ['/api/health', '/api/issues']
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/issues', issueRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: 'Route not found.' }
  });
});

// Central error handler
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Request body is not valid JSON.' }
    });
  }
  console.error(error);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: error.message || 'An unexpected server error occurred.' }
  });
});

app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`Cloud Issue API listening on http://localhost:${PORT} (${env})`);
});

module.exports = app;