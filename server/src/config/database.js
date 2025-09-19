import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const databaseUrl = (isTest && process.env.DATABASE_URL_TEST) || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL (or DATABASE_URL_TEST) not set');

export const sequelize = new Sequelize(databaseUrl, {
  logging: process.env.DB_LOG_SQL === 'true' ? console.log : false,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : undefined
  }
});

export async function testConnection() { await sequelize.authenticate(); }
