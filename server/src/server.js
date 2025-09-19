import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
(async () => {
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Server running on :${PORT}`));
})();
