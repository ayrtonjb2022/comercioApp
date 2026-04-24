// config/db.js
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,

    // ZONA HORARIA DE ARGENTINA – SOLUCIÓN PRINCIPAL
    timezone: 'America/Argentina/Buenos_Aires',

    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 300000,
    },

    dialectOptions: {
      connectTimeout: 60000,
      decimalNumbers: true,
      // Opcional: también forzar la zona horaria en la conexión MySQL (por si acaso)
      // timezone: 'America/Argentina/Buenos_Aires',
    },
  }
);

export default sequelize;