const allowedOrigins = [
  "http://localhost:5173",          // Local Vite dev server
  "https://localhost:5173",         // Optional, for local HTTPS
  "https://recipe-share-six.vercel.app", // Your frontend
  "https://recipen.vercel.app",    // Comment out if obsolete
];

module.exports = allowedOrigins;