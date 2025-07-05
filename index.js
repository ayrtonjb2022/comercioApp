import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRouter from './routers/authRouter.js';
import cajaRouter from './routers/cajaRouter.js';
import productoRouter from './routers/productoRouter.js';
import movimientoRouter from './routers/movimientoRouter.js';
import dataUs from './routers/dataUsRouter.js';

import ventasRouter from './routers/ventasRouter.js';
import sequelize from './config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', cajaRouter);
app.use('/api', productoRouter);
app.use('/api', movimientoRouter);

app.use('/api', ventasRouter);
app.use('/api', dataUs);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    sequelize.sync({ force: false })
        .then(() => {
            console.log('Database synced');
        })
        .catch((err) => {
            console.error('Unable to sync database:', err);
        });
});