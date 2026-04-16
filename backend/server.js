require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { sequelize } = require('./src/models');
const errorHandler = require('./src/middlewares/errorHandler');
const healthRoutes = require('./src/routes/health');
const projectRoutes = require('./src/routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Utility Middleware ───────────────────────────
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));   // 10mb for large JSON payloads
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/projects', projectRoutes);

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.url} not found` });
});

// ── Error Handler (must be last) ────────────────────────────
app.use(errorHandler);

// ── DB Sync + Server Start ───────────────────────────────────
const startServer = async () => {
  try {
    // alter: true — updates tables if models change, safe for dev
    // Use force: true ONLY to wipe and recreate (never in prod)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();