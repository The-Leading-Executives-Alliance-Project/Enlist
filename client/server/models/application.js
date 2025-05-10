// server/models/application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
    default: 'draft',
  },
  academicInfo: {
    gpa: Number,
    testScores: {
      type: Map,
      of: String,
    },
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
  submissionDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);