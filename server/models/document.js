// models/document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileCategory: {
    type: String,
    required: true,
    // Can be school name (UBC, SFU, Sauder, Beedie) or 'personal'
  },
  documentName: {
    type: String,
    required: true,
    // e.g., "Personal Statement", "Why UBC", "Why Sauder"
  },
  essay: {
    type: String,
    default: '',
  },
  highlightedRanges: [{
    start: Number,
    end: Number,
    changeIndex: Number,
    messageIndex: Number,
  }],
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    changes: [{
      originalText: String,
      newText: String,
      title: String,
      description: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    }],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  lastModified: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create compound index to ensure one document per user per document type
documentSchema.index({ userId: 1, fileCategory: 1, documentName: 1 }, { unique: true });

module.exports = mongoose.model('Document', documentSchema);