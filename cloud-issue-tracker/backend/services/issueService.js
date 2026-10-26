// Lab 5: chooses where issues are stored. The controller always imports THIS file,
// so routes and controller never change when the storage changes.
const databaseUrl = (process.env.DATABASE_URL || '').trim();
const inTheCloud = Boolean(process.env.VERCEL) || process.env.NODE_ENV === 'production';

function missingDatabase() {
  throw new Error('DATABASE_URL is not set. Add it in Vercel: Settings > Environment Variables, then Redeploy.');
}

let service;

if (databaseUrl) {
  service = require('./neonIssueService');
  console.log('Issue storage: Neon Postgres (DATABASE_URL)');
} else if (inTheCloud) {
  service = { readIssues: missingDatabase, createIssue: missingDatabase, updateIssueStatus: missingDatabase };
  console.error('Issue storage: NOT CONFIGURED. DATABASE_URL is missing.');
} else {
  service = require('./jsonIssueService');
  console.log('Issue storage: local JSON file (backend/data/issues.json)');
}

module.exports = service;