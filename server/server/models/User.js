// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'counselor'],
    default: 'student'
  },
  profile: {
    education: [{
      institution: String,
      degree: String,
      field: String,
      graduationYear: Number
    }],
    workExperience: [{
      company: String,
      position: String,
      duration: String
    }],
    skills: [String],
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);