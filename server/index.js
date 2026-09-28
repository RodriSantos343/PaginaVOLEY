const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Root healthcheck
app.get('/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    res.json({
      status: 'ok',
      db: 'connected to PostgreSQL',
      timestamp: result.rows[0].current_time
    });
  } catch (err) {
    res.status(500).json({ status: 'error', db_error: err.message });
  }
});

// Serve frontend in production if built
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🏐 Servidor Torneo de Voleybol ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 API lista en http://localhost:${PORT}/api`);
});
