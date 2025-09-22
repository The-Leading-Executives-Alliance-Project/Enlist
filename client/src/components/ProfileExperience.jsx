// src/components/ProfileExperience.jsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import ExperienceForm from './ExperienceForm';
import api from '../services/api';

const ProfileExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/userprofile/me');
      if (response.data && response.data.experiences) {
        setExperiences(response.data.experiences);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSaveExperience = async (experienceData) => {
    try {
      let updatedExperiences;
      
      if (isEditing && editingExperience) {
        // Update existing experience
        updatedExperiences = experiences.map(exp => 
          exp === editingExperience ? experienceData : exp
        );
      } else {
        // Add new experience
        updatedExperiences = [...experiences, experienceData];
      }

      // Update the profile with new experiences
      const response = await api.post('/userprofile', { experiences: updatedExperiences });
      
      if (response.data) {
        setExperiences(response.data.experiences || []);
        setShowForm(false);
        setEditingExperience(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience. Please try again.');
    }
  };

  const handleDeleteExperience = async (experienceToDelete) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      const updatedExperiences = experiences.filter(exp => exp !== experienceToDelete);
      const response = await api.post('/userprofile', { experiences: updatedExperiences });
      
      if (response.data) {
        setExperiences(response.data.experiences || []);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Error deleting experience. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExperience(null);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getCoreValueColor = (value) => {
    const colors = {
      'Authenticity': 'bg-blue-100 text-blue-800',
      'Curiosity': 'bg-green-100 text-green-800',
      'Empathy': 'bg-purple-100 text-purple-800',
      'Leadership': 'bg-red-100 text-red-800',
      'Resilience/Growth': 'bg-orange-100 text-orange-800',
      'Responsibility': 'bg-yellow-100 text-yellow-800',
      'Social Change': 'bg-pink-100 text-pink-800',
      'Courage': 'bg-indigo-100 text-indigo-800',
      'Collaboration': 'bg-teal-100 text-teal-800',
      'Purpose': 'bg-gray-100 text-gray-800'
    };
    return colors[value] || colors['Purpose'];
  };

  const getCoreValueDescription = (value) => {
    const descriptions = {
      'Authenticity': 'Shows self-awareness and genuine character',
      'Curiosity': 'Demonstrates intellectual engagement and love of learning',
      'Empathy': 'Reveals emotional intelligence and ability to connect with others',
      'Leadership': 'Shows initiative and ability to create positive change',
      'Resilience/Growth': 'Indicates ability to overcome challenges and learn from setbacks',
      'Responsibility': 'Demonstrates maturity and accountability',
      'Social Change': 'Shows commitment to making a meaningful impact',
      'Courage': 'Reveals willingness to take risks and stand up for beliefs',
      'Collaboration': 'Shows ability to work well with diverse groups',
      'Purpose': 'Demonstrates direction and meaningful motivation'
    };
    return descriptions[value] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading experiences...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Experiences</h3>
        <button 
          onClick={handleAddExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No experiences yet</h4>
          <p className="text-gray-500 mb-4">Add your work, volunteer, internship, and other experiences to showcase your background.</p>
          <button 
            onClick={handleAddExperience}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{experience.organization}</h4>
                  
                  {/* Core Values */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {experience.coreValues && experience.coreValues.map((value, valueIndex) => (
                      <div key={valueIndex} className="relative group">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCoreValueColor(value)}`}>
                          {value}
                        </span>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 w-64">
                          {getCoreValueDescription(value)}
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}
                      </span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditExperience(experience)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit experience"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(experience)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete experience"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {experience.description && (
                <p className="text-gray-700 mb-4">{experience.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ExperienceForm
          experience={editingExperience}
          onSave={handleSaveExperience}
          onCancel={handleCancelForm}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ProfileExperience;