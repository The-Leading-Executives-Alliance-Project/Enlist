// models/document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Document', documentSchema);