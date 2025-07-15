// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/api';
import Form from '../components/Form';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [hasCompletedForm, setHasCompletedForm] = useState(false);

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/userprofile/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setProfileData(data);
            // Check if user has completed the form by looking for required fields
            const hasRequiredFields = data.dateOfBirth && 
                                    data.nationality && 
                                    data.gender && 
                                    data.countryOfResidence && 
                                    data.phoneNumber;
            setHasCompletedForm(hasRequiredFields);
          }
        } else {
          // If no profile exists, user hasn't completed the form
          setHasCompletedForm(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If no profile exists, user hasn't completed the form
        setHasCompletedForm(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // If no user data, show loading
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // If user hasn't completed the form, show the form
  if (!hasCompletedForm) {
    return <Form onFormComplete={() => setHasCompletedForm(true)} />;
  }

  // Helper function to format data for display
  const formatValue = (value) => {
    if (!value) return 'Not provided';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not provided';
    }
    return value;
  };

  // Render Personal Information tab
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          Edit
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.dateOfBirth)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.nationality)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.gender)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.countryOfResidence)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.phoneNumber)}
          </div>
        </div>
      </div>
    </div>
  );

  // Render School Details tab
  const renderSchoolDetails = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">School Details</h3>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          Edit
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Country</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.schoolCountry)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Province/State</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.schoolProvince)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School City</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.schoolCity)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Grade</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.currentGrade)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Date</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.graduationDate)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.gpa)}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Destination tab
  const renderDestination = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Destination</h3>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          Edit
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Countries</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.preferredCountries)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Major</label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formatValue(profileData.preferredMajor)}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Test Results tab
  const renderTestResults = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Test Results</h3>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          Edit
        </button>
      </div>
      
      <div className="space-y-8">
        {/* Academic Programs */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">Academic Programs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Program</label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                {formatValue(profileData.academicProgram)}
              </div>
            </div>
            
            {profileData.academicProgram === 'IB' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IB Score</label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {formatValue(profileData.ibScore)}
                </div>
              </div>
            )}
            
            {profileData.academicProgram === 'AP' && profileData.apScores && profileData.apScores.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">AP Scores</label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {profileData.apScores.map((score, index) => (
                    <div key={index} className="mb-1">
                      {score.course}: {score.score}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.academicProgram === 'A-Level' && profileData.aLevelScores && profileData.aLevelScores.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">A-Level Scores</label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {profileData.aLevelScores.map((score, index) => (
                    <div key={index} className="mb-1">
                      {score.course}: {score.score}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* College Admissions Tests */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">College Admissions Tests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Test</label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                {formatValue(profileData.collegeTest)}
              </div>
            </div>
            
            {profileData.collegeTest === 'SAT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SAT Reading</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.satReading)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SAT Grammar</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.satGrammar)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SAT Math</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.satMath)}
                  </div>
                </div>
              </>
            )}
            
            {profileData.collegeTest === 'ACT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ACT English</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.actEnglish)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ACT Math</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.actMath)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ACT Reading</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.actReading)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ACT Science</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.actScience)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* English Proficiency Tests */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4">English Proficiency Tests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English Test</label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                {formatValue(profileData.englishTest)}
              </div>
            </div>
            
            {profileData.englishTest === 'TOEFL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TOEFL Score</label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {formatValue(profileData.toeflScore)}
                </div>
              </div>
            )}
            
            {profileData.englishTest === 'IELTS' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IELTS Listening</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.ieltsListening)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IELTS Reading</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.ieltsReading)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IELTS Speaking</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.ieltsSpeaking)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IELTS Writing</label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formatValue(profileData.ieltsWriting)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'school':
        return renderSchoolDetails();
      case 'destination':
        return renderDestination();
      case 'tests':
        return renderTestResults();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'personal', label: 'Personal Information' },
              { id: 'school', label: 'School Details' },
              { id: 'destination', label: 'Destination' },
              { id: 'tests', label: 'Test Results' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
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
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;