require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const authenticateApiKey = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const BIND_IP = process.env.BIND_IP || '0.0.0.0';

// Enable trust proxy for reverse proxy headers (e.g., X-Forwarded-For)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Main API routes with authentication
app.use('/api', authenticateApiKey, apiRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Termux Backend is running!' });
});

app.listen(PORT, BIND_IP, () => {
  console.log(`Server listening at http://${BIND_IP}:${PORT}`);
});
