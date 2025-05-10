// config/env.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://test_user:leappassword@leap-enlist.6bosfen.mongodb.net/?retryWrites=true&w=majority&appName=LEAP-ENLIST',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: '24h',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};