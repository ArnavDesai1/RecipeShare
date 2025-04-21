const allowedOrigins = [
  process.env.CLIENT_BASE_URL || 'https://recipe-share-six.vercel.app',
  'http://localhost:5173' // For local testing
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log(`Checking CORS origin: ${origin}`); // Debug log
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'] // If returning tokens
};

module.exports = corsOptions;