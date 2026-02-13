import * as repo from './domains.repo.js';

export async function listDomains(filters) {
  return repo.findDomains(filters);
}

export async function importDomains(domains) {
  return repo.bulkInsert(domains);
}

export async function markReacquired(id) {
  return repo.updateStatus(id, 'reacquired');
}
