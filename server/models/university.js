const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const universitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  province:{
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  majors: [{
    name: String,
    acceptanceRate: String,
    avgGPA: String,
    avgSAT: String,
    avgACT: String,
    requirements: [String]
  }],
  overallAcceptanceRate: {
    type: String,
    default: 'N/A'
  },
  avgGPA: {
    type: String,
    default: 'N/A'
  },
  avgSAT: {
    type: String,
    default: 'N/A'
  },
  avgACT: {
    type: String,
    default: 'N/A'
  },
  tuition: {
    domestic: String,
    international: String
  },
  ranking: {
    national: Number,
    world: Number
  },
  website: String,
  description: String,
  imageUrl: String,
  tags: [String]
}, { 
  timestamps: true 
});

universitySchema.index({
  name: 'text',
  country: 'text',
  city: 'text',
  'majors.name': 'text',
  tags: 'text'
});

module.exports = mongoose.model('University', universitySchema); 