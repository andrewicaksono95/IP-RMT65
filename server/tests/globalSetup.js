import dotenv from 'dotenv';
import { sequelize } from '../src/config/database.js';
import '../src/models/index.js';

export default async () => {
  dotenv.config();
  if (process.env.NODE_ENV !== 'test') {
    // Enforce test safety
    throw new Error('globalSetup must run with NODE_ENV=test');
  }
  if (!process.env.DATABASE_URL_TEST) {
    console.warn('WARNING: DATABASE_URL_TEST not set; using DATABASE_URL. Ensure this is a disposable test DB.');
  }
  await sequelize.sync({ force: true });
};
