const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE_URL = isLocal
  ? 'http://localhost:3000/api/issues'
  : 'https://cloud-issue-tracker-api-tau.vercel.app/api/issues';