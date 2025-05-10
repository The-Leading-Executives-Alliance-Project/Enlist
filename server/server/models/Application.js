// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    name: {
      type: String,
      required: true
    },
    university: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['undergraduate', 'graduate', 'phd'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
    default: 'draft'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  personalStatement: {
    type: String
  },
  academicRecords: [{
    institution: String,
    gpa: Number,
    transcriptUrl: String
  }],
  aiRecommendations: {
    programFit: Number,
    successProbability: Number,
    suggestions: [String]
  },
  submissionDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);