import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './config/database.js';

dotenv.config();

// Use port 3000 for local development unless overridden
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
