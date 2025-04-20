const allowedOrigins = [
  "http://localhost:5173",          // Local Vite dev server
  "https://localhost:5173",         // Optional, for local HTTPS
  "https://recipe-share-six.vercel.app", // Your new deployment
  // "https://recipen.vercel.app"     // Comment out or remove if obsolete
];

module.exports = allowedOrigins;