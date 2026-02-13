import * as service from './domains.service.js';

/**
 * List domains with optional filters and pagination
 */
export async function listDomains(req, res, next) {
  try {
    const { year, month, ext, search, status, page, limit } = req.query;

    const query = {
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      ext,
      search,
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 25
    };

    const data = await service.listDomains(query);
    res.json({ data, page: query.page, limit: query.limit });
  } catch (err) {
    console.error('Error in listDomains:', err.message);
    next(err);
  }
}

/**
 * Import multiple domains in bulk
 */
export async function importDomains(req, res, next) {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array of domain objects' });
    }

    // Validate each domain object
    const invalidRecords = req.body.filter(
      d => !d.full_domain || !d.name || !d.extension || !d.deleted_month || !d.deleted_year
    );

    if (invalidRecords.length > 0) {
      return res.status(400).json({ 
        error: 'Some domain records are missing required fields',
        invalidRecords
      });
    }

    const result = await service.importDomains(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error in importDomains:', err.message);
    next(err);
  }
}

/**
 * Mark a domain as reacquired
 */
export async function markReacquired(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Domain ID is required' });
    }

    const result = await service.markReacquired(id);

    if (!result) {
      return res.status(404).json({ error: 'Domain not found or already updated' });
    }

    res.json(result);
  } catch (err) {
    console.error('Error in markReacquired:', err.message);
    next(err);
  }
}
