import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouter.js';
import cajaRouter from './routers/cajaRouter.js';
import productoRouter from './routers/productoRouter.js';
import movimientoRouter from './routers/movimientoRouter.js';
import dataUs from './routers/dataUsRouter.js';
import ventasRouter from './routers/ventasRouter.js';
import healthRouter from './routers/health.js';
import Categoria from './routers/categoriaRouter.js';

import sequelize from './config/db.js';
import './models/index.js';  

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://comercioappf.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `El CORS policy no permite el acceso desde el origen ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api', cajaRouter);
app.use('/api', productoRouter);
app.use('/api', movimientoRouter);
app.use('/api', ventasRouter);
app.use('/api', dataUs);
app.use('/api/health', healthRouter);
app.use("/api", Categoria);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos MySQL.');

    await sequelize.sync({ force: false });
    console.log('📦 Modelos sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    setTimeout(startServer, 5000); // Reintenta la conexión en 5 segundos
  }
};

startServer();

// Opcional: mantener la conexión activa cada 5 minutos
setInterval(async () => {
  try {
    await sequelize.query('SELECT 1');
    console.log('🔄 Ping a la DB');
  } catch (err) {
    console.error('Error al hacer ping a la DB:', err.message);
  }
}, 5 * 60 * 1000); // cada 5 minutos
