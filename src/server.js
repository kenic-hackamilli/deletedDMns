import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { pool } from '../config/db.js';

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Test DB connection
    const { rows } = await pool.query(`
      SELECT current_database(), current_user, current_schema();
    `);

    console.log('✅ Connected to DB:', rows[0]);

    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1); // stop server if DB fails
  }
}

startServer();
