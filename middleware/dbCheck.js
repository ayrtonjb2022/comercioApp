// middleware/dbCheck.js
import sequelize from '../config/db.js';

const dbConnectionCheck = async (req, res, next) => {
  // Solo para rutas importantes que requieren BD
  const importantRoutes = ['/api/productos', '/api/cajas', '/api/ventas'];
  
  if (importantRoutes.some(route => req.path.startsWith(route))) {
    try {
      await sequelize.authenticate();
      next();
    } catch (error) {
      console.log('Reconectando a BD...');
      try {
        await sequelize.connectionManager.initPools();
        next();
      } catch (retryError) {
        console.error('No se pudo reconectar:', retryError);
        res.status(503).json({ 
          error: 'Database temporarily unavailable',
          code: 'DB_CONNECTION_LOST'
        });
      }
    }
  } else {
    next();
  }
};

export default dbConnectionCheck;