const allowedOrigins = [
  "http://localhost:5173",          // Local Vite dev server (HTTP)
  "https://localhost:5173",         // Optional, for local HTTPS testing
  "https://recipen.vercel.app",     // Original deployment (keep if still used)
  "https://recipe-share-six.vercel.app", // Your new deployment
];

module.exports = allowedOrigins;