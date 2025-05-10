// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get authenticated user data
    const userData = AuthService.getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const applications = [
    {
      id: 1,
      university: 'University of British Columbia',
      program: 'Computer Science',
      status: 'In Progress',
      deadline: '2024-04-15',
    },
    // Add more mock data as needed
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          {user && <p className="text-gray-600 mt-2">Welcome, {user.name}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {app.university}
            </h3>
            <p className="text-gray-600 mb-4">{app.program}</p>
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                app.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''
              }`}>
                {app.status}
              </span>
              <span className="text-sm text-gray-500">
                Due: {new Date(app.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Start New Application
      </button>
    </div>
  );
};

export default Dashboard;