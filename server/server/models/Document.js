// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['transcript', 'recommendation_letter', 'resume', 'personal_statement', 'language_test', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  metadata: {
    fileSize: Number,
    mimeType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  aiAnalysis: {
    quality: Number,
    completeness: Number,
    suggestions: [String]
  }
});

module.exports = mongoose.model('Document', documentSchema);