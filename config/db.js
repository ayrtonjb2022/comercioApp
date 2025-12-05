// config/db.js - VERSIÓN MÍNIMA CORREGIDA
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
    
    // SOLO LO ESENCIAL PARA RESOLVER TU PROBLEMA
    pool: {
      max: 10,
      min: 2,          // Mantener al menos 2 conexiones abiertas
      acquire: 30000,
      idle: 300000,    // 5 minutos (antes era 10000 = 10 segundos)
    },
    
    // SOLO OPCIONES VÁLIDAS
    dialectOptions: {
      connectTimeout: 60000,
      decimalNumbers: true,
    },
  }
);

export default sequelize;