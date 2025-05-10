// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');
const { PORT } = require('./config/env');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;