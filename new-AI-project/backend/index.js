require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articles');
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');
const summarizeRoutes = require('./routes/summarize');
const analyzeUrlRoutes = require('./routes/analyzeUrl');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/summarize', summarizeRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/analyze-url', analyzeUrlRoutes);
app.use('/api/analyze-url', analyzeUrlRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI News Aggregator API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
