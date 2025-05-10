// config/db.js
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Connection string used:', MONGODB_URI);
    return false;
  }
};

module.exports = { connectDB };