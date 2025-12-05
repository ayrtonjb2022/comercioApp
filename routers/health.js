// routes/health.js
import express from 'express';
import sequelize from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Verificar conexión a BD
    await sequelize.authenticate();
    
    // Opcional: consulta simple
    await sequelize.query('SELECT 1');
    
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;