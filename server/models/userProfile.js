const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dateOfBirth: String,
  nationality: String,
  gender: String,
  countryOfResidence: String,
  phoneNumber: String,
  schoolCountry: String,
  schoolProvince: String,
  schoolCity: String,
  currentGrade: String,
  graduationDate: String,
  gpa: String,
  preferredCountries: [String],
  preferredMajor: String,
  academicProgram: String,
  ibScore: String,
  apScores: [{ course: String, score: String }],
  aLevelScores: [{ course: String, score: String }],
  collegeTest: String,
  toeflScore: String,
  ieltsListening: String,
  ieltsReading: String,
  ieltsSpeaking: String,
  ieltsWriting: String,
  satReading: String,
  satGrammar: String,
  satMath: String,
  actEnglish: String,
  actMath: String,
  actReading: String,
  actScience: String,
  englishTest: String,
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema); 