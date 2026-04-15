const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// GET /api/health
router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      success: true,
      message: 'API Contract Platform is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    });
  }
});

module.exports = router;