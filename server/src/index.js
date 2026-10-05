require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const hospitalRoutes = require('./routes/hospitalRoutes');
const aiRoutes = require('./routes/aiRoutes');
const bloodRoutes = require('./routes/bloodRoutes');
const medicineRoutes = require('./routes/medicineRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', hospitalRoutes);
app.use('/api', aiRoutes);
app.use('/api', bloodRoutes);
app.use('/api', medicineRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Hospital Finder API',
    timestamp: new Date()
  });
});

// Root API welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hospital Finder API - Find the RIGHT Hospital at the RIGHT TIME',
    documentation: '/api/hospitals, /api/extract-requirements, /api/match-hospitals'
  });
});

// Start Server & Connect Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  Hospital Finder Backend Server running on port ${PORT}`);
    console.log(`  Local Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
});
