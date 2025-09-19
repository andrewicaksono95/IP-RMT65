import { sequelize } from '../src/config/database.js';

export default async () => {
  await sequelize.close();
};
