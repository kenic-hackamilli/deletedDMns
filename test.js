import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

(async () => {
  try {
    const res = await pool.query('SELECT current_database(), current_user, current_schema();');
    console.log('DB Info:', res.rows);

    // Try to select from your table
    const domains = await pool.query('SELECT * FROM public.domains_deleted LIMIT 1;');
    console.log('Domains:', domains.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
})();
