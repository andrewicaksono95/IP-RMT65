import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: process.env.DB_LOG_SQL === 'true' ? console.log : false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : undefined
    }
  },
  test: {
    url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : undefined
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : undefined
    }
  }
};