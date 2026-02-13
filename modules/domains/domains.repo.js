import { pool } from '../../config/db.js';

/**
 * Fetch domains with optional filters and pagination
 */
export async function findDomains({
  year,
  month,
  ext,
  search,
  status = 'deleted',
  page = 1,
  limit = 50
}) {
  const offset = (page - 1) * limit;

  let query = `
    SELECT * FROM public.domains_deleted
    WHERE status = $1
  `;
  const values = [status];
  let idx = 2;

  if (year) {
    query += ` AND deleted_year = $${idx++}`;
    values.push(Number(year));
  }
  if (month) {
    query += ` AND deleted_month = $${idx++}`;
    values.push(Number(month));
  }
  if (ext) {
    query += ` AND extension = $${idx++}`;
    values.push(ext);
  }
  if (search) {
    query += ` AND name ILIKE $${idx++}`;
    values.push(`%${search.toLowerCase()}%`);
  }

  query += ` ORDER BY deleted_year DESC, deleted_month DESC LIMIT $${idx++} OFFSET $${idx++}`;
  values.push(Number(limit), Number(offset));

  const { rows } = await pool.query(query, values);
  return rows;
}

/**
 * Bulk insert domains into the database
 */
export async function bulkInsert(domains) {
  if (!Array.isArray(domains) || domains.length === 0) {
    throw new Error('Input must be a non-empty array of domain objects');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const d of domains) {
      const { full_domain, name, extension, deleted_month, deleted_year } = d;

      if (!full_domain || !name || !extension || !deleted_month || !deleted_year) {
        console.warn('Skipping invalid domain record:', d);
        continue; // skip invalid records
      }

      await client.query(
        `
        INSERT INTO public.domains_deleted (full_domain, name, extension, deleted_month, deleted_year)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (full_domain) DO NOTHING
        `,
        [full_domain, name, extension, deleted_month, deleted_year]
      );
    }

    await client.query('COMMIT');
    return { inserted: domains.length };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Bulk Insert Error:', e.message);
    throw new Error('Failed to insert domains. See server logs.');
  } finally {
    client.release();
  }
}

/**
 * Update the status of a domain (e.g., when reacquired)
 */
export async function updateStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE public.domains_deleted 
     SET status = $1, updated_at = NOW() 
     WHERE id = $2 
     RETURNING *`,
    [status, id]
  );
  return rows[0];
}
