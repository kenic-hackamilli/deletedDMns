import fs from 'fs';
import fetch from 'node-fetch';

async function importDomains() {
  try {
    const data = JSON.parse(fs.readFileSync('domains.json', 'utf8'));

    const response = await fetch('http://localhost:4000/api/domains/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Import result:', result);
  } catch (err) {
    console.error('Error importing domains:', err);
  }
}

importDomains();
