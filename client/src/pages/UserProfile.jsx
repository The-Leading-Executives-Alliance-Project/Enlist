// src/pages/UserProfile.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // If no user data, show loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          User Profile
        </h2>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {user.fullName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {'•'.repeat(12)} {/* Display masked password */}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                AuthService.logout();
                navigate('/login');
              }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;