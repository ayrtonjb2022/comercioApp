import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false
});
// const sequelize = new Sequelize("kiosco2", "root", "", {
//     host: "localhost",
//     dialect: 'mysql',
//     dialectModule: mysql2,
//     logging: false
// });
//lo ocupo si tengo que configurar algo localmente

export default sequelize;