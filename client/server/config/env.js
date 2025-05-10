// server/config/env.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/concis_evolve',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: '24h',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};