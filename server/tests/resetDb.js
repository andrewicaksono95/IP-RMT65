import { sequelize } from '../src/config/database.js';
import '../src/models/index.js';

export async function resetDb() {
  await sequelize.truncate({ cascade: true });
}
