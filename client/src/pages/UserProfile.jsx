// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/api';
import api from '../services/api';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Country } from 'country-state-city';
import Select from 'react-select';
import ProfileExperience from '../components/ProfileExperience';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // Track which tab is active
  const [formData, setFormData] = useState({
    gender: '',
    countryOfResidence: '',
    currentGrade: '',
    gpa: '',
    preferredMajor: '',
    englishTest: '',
    toeflScore: '',
    ieltsListening: '',
    ieltsReading: '',
    ieltsSpeaking: '',
    ieltsWriting: ''
  });

  // Country options for dropdown
  const countryOptions = Country.getAllCountries().map(country => ({
    value: country.isoCode,
    label: country.name
  })).sort((a, b) => a.label.localeCompare(b.label));

  // Major options (simplified list)
  const majorOptions = [
    { value: 'Not decided', label: 'Not decided' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Always try to fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await api.get('/userprofile/me');
        if (response.data) {
          setProfileData(response.data);
          // Populate form data
          setFormData({
            gender: response.data.gender || '',
            countryOfResidence: response.data.countryOfResidence || '',
            currentGrade: response.data.currentGrade || '',
            gpa: response.data.gpa || '',
            preferredMajor: response.data.preferredMajor || '',
            englishTest: response.data.englishTest || '',
            toeflScore: response.data.toeflScore || '',
            ieltsListening: response.data.ieltsListening || '',
            ieltsReading: response.data.ieltsReading || '',
            ieltsSpeaking: response.data.ieltsSpeaking || '',
            ieltsWriting: response.data.ieltsWriting || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Check if profile is complete
  const isProfileComplete = () => {
    return formData.gender && 
           formData.countryOfResidence && 
           formData.currentGrade && 
           formData.gpa && 
           formData.preferredMajor && 
           formData.englishTest &&
           (formData.englishTest === 'Neither' || 
            (formData.englishTest === 'TOEFL' && formData.toeflScore) ||
            (formData.englishTest === 'IELTS' && formData.ieltsListening && formData.ieltsReading && formData.ieltsSpeaking && formData.ieltsWriting));
  };

  // Set editing mode based on profile completion (only on initial load)
  useEffect(() => {
    if (!loading && profileData) {
      setIsEditing(!isProfileComplete());
    }
  }, [loading, profileData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/userprofile', formData);
      console.log('Profile submitted successfully:', response.data);
      
      // Update profile data
      setProfileData(response.data);
      setIsEditing(false);
      
      // Update user object in localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.formCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      if (err.response) {
        console.error('Profile submission error:', err.response.data);
        alert('Error: ' + (err.response.data.error || 'Unknown error'));
      } else {
        console.error('Profile submission error:', err.message);
        alert('Error: ' + err.message);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profileData) {
      // Restore original form data from profileData
      setFormData({
        gender: profileData.gender || '',
        countryOfResidence: profileData.countryOfResidence || '',
        currentGrade: profileData.currentGrade || '',
        gpa: profileData.gpa || '',
        preferredMajor: profileData.preferredMajor || '',
        englishTest: profileData.englishTest || '',
        toeflScore: profileData.toeflScore || '',
        ieltsListening: profileData.ieltsListening || '',
        ieltsReading: profileData.ieltsReading || '',
        ieltsSpeaking: profileData.ieltsSpeaking || '',
        ieltsWriting: profileData.ieltsWriting || ''
      });
    }
    setIsEditing(false);
  };

  // Helper function to format data for display
  const formatValue = (value) => {
    if (!value) return 'Not provided';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not provided';
    }
    return value;
  };

  // If no user data, show loading
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            {!isProfileComplete() && (
              <div className="flex items-center gap-2 text-red-600">
                <XMarkIcon className="h-6 w-6" />
                <ExclamationTriangleIcon className="h-6 w-6" />
                <span className="text-sm font-medium">Profile Incomplete</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'experiences', label: 'Experiences' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-purple-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'basic' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                {!isEditing && isProfileComplete() && (
                  <button 
                    onClick={handleEdit}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                )}
                {isEditing && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!isProfileComplete()}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        isProfileComplete() 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                      {formatValue(formData.gender)}
                    </div>
                  )}
                </div>

                {/* Country of Residence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country of Residence *
                  </label>
                  {isEditing ? (
                    <Select
                      value={countryOptions.find(option => option.value === formData.countryOfResidence)}
                      onChange={(option) => handleInputChange('countryOfResidence', option ? option.value : '')}
                      options={countryOptions}
                      placeholder="Select your country of residence"
                      isSearchable
                      className="w-full"
                      classNamePrefix="react-select"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                      {formatValue(countryOptions.find(option => option.value === formData.countryOfResidence)?.label)}
                    </div>
                  )}
                </div>

                {/* Current Grade Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Grade Level *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.currentGrade}
                      onChange={(e) => handleInputChange('currentGrade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select grade</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                      {formatValue(formData.currentGrade)}
                    </div>
                  )}
                </div>

                {/* GPA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select GPA</option>
                      <option value="Not available">Not available</option>
                      <option value="4.0">4.0</option>
                      <option value="3.9">3.9</option>
                      <option value="3.8">3.8</option>
                      <option value="3.7">3.7</option>
                      <option value="3.6">3.6</option>
                      <option value="3.5">3.5</option>
                      <option value="3.4">3.4</option>
                      <option value="3.3">3.3</option>
                      <option value="3.2">3.2</option>
                      <option value="3.1">3.1</option>
                      <option value="3.0">3.0</option>
                      <option value="2.9">2.9</option>
                      <option value="2.8">2.8</option>
                      <option value="2.7">2.7</option>
                      <option value="2.6">2.6</option>
                      <option value="2.5">2.5</option>
                      <option value="2.4">2.4</option>
                      <option value="2.3">2.3</option>
                      <option value="2.2">2.2</option>
                      <option value="2.1">2.1</option>
                      <option value="2.0">2.0</option>
                      <option value="1.9">1.9</option>
                      <option value="1.8">1.8</option>
                      <option value="1.7">1.7</option>
                      <option value="1.6">1.6</option>
                      <option value="1.5">1.5</option>
                      <option value="1.4">1.4</option>
                      <option value="1.3">1.3</option>
                      <option value="1.2">1.2</option>
                      <option value="1.1">1.1</option>
                      <option value="1.0">1.0</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.6">0.6</option>
                      <option value="0.5">0.5</option>
                      <option value="0.4">0.4</option>
                      <option value="0.3">0.3</option>
                      <option value="0.2">0.2</option>
                      <option value="0.1">0.1</option>
                      <option value="0.0">0.0</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                      {formatValue(formData.gpa)}
                    </div>
                  )}
                </div>

                {/* Preferred Major */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Major *
                  </label>
                  {isEditing ? (
                    <Select
                      value={majorOptions.find(option => option.value === formData.preferredMajor)}
                      onChange={(option) => handleInputChange('preferredMajor', option ? option.value : '')}
                      options={majorOptions}
                      placeholder="Select or search for your preferred major"
                      isSearchable
                      className="w-full"
                      classNamePrefix="react-select"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                      {formatValue(formData.preferredMajor)}
                    </div>
                  )}
                </div>

                {/* English Proficiency Test */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Proficiency Test *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.englishTest}
                      onChange={(e) => handleInputChange('englishTest', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select test</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="IELTS">IELTS</option>
                      <option value="Neither">Neither</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                      {formatValue(formData.englishTest)}
                    </div>
                  )}
                </div>

                {/* TOEFL Score */}
                {formData.englishTest === 'TOEFL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TOEFL Score *
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={formData.toeflScore}
                        onChange={(e) => handleInputChange('toeflScore', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter TOEFL score (0-120)"
                        required
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                        {formatValue(formData.toeflScore)}
                      </div>
                    )}
                  </div>
                )}

                {/* IELTS Scores */}
                {formData.englishTest === 'IELTS' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IELTS Listening *
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.ieltsListening}
                          onChange={(e) => handleInputChange('ieltsListening', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select score</option>
                          {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(score => (
                            <option key={score} value={score}>{score}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                          {formatValue(formData.ieltsListening)}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IELTS Reading *
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.ieltsReading}
                          onChange={(e) => handleInputChange('ieltsReading', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select score</option>
                          {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(score => (
                            <option key={score} value={score}>{score}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                          {formatValue(formData.ieltsReading)}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IELTS Speaking *
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.ieltsSpeaking}
                          onChange={(e) => handleInputChange('ieltsSpeaking', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select score</option>
                          {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(score => (
                            <option key={score} value={score}>{score}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                          {formatValue(formData.ieltsSpeaking)}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IELTS Writing *
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.ieltsWriting}
                          onChange={(e) => handleInputChange('ieltsWriting', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select score</option>
                          {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(score => (
                            <option key={score} value={score}>{score}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                          {formatValue(formData.ieltsWriting)}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'experiences' && (
            <ProfileExperience />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;