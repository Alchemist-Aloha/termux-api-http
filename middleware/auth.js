const API_KEY = process.env.API_KEY;

const authenticateApiKey = (req, res, next) => {
  const providedKey = req.headers['x-api-key'] || req.query.api_key;

  if (!API_KEY) {
    console.warn('Warning: API_KEY is not set in environment variables.');
    return next(); // Or return 500 if you want to force security
  }

  if (providedKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }

  next();
};

module.exports = authenticateApiKey;
