// src/components/DocumentForm.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import universitiesData from '../utils/universities.json';

const DocumentForm = ({ onSave, onCancel, fileCategory }) => {
  const [formData, setFormData] = useState({
    documentName: '',
    fileCategory: fileCategory,
    universityName: '',
    majorName: ''
  });

  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Major options with "Undecided" at the top
  const majorOptions = [
    'Undecided',
    'Computer Science',
    'Software Engineering',
    'Data Science',
    'Business Administration',
    'Medicine',
    'Engineering',
    'Psychology',
    'Economics',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'English',
    'History',
    'Political Science',
    'International Relations',
    'Art',
    'Music',
    'Architecture',
    'Nursing',
    'Education',
    'Law',
    'Other'
  ];

  useEffect(() => {
    // Load universities from local JSON file
    const universityList = universitiesData.universities;
    setUniversities(universityList);
    setFilteredUniversities(universityList.slice(0, 50)); // Show first 50 by default
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.university-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = universities.filter(uni => 
        uni.name && (
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (uni.country && uni.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (uni.province && uni.province.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (uni.state && uni.state.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      ).slice(0, 20); // Limit to 20 results for performance
      setFilteredUniversities(filtered);
    } else {
      setFilteredUniversities(universities.slice(0, 50));
    }
  }, [searchTerm, universities]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUniversitySelect = (university) => {
    setFormData(prev => ({
      ...prev,
      universityName: university.name
    }));
    setSearchTerm(university.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.documentName) {
      alert('Please enter a document name');
      return;
    }

    if (fileCategory === 'university' && (!formData.universityName || !formData.majorName)) {
      alert('Please select both university and major');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Add New {fileCategory === 'personal' ? 'Personal' : 'University'} Document
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Document Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={formData.documentName}
                onChange={(e) => handleInputChange('documentName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Personal Statement, Why UBC, Leadership Experience"
                required
              />
            </div>

            {/* University Selection (only for university category) */}
            {fileCategory === 'university' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <div className="relative university-dropdown">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search for a university..."
                    required
                  />
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((university, index) => (
                          <div
                            key={index}
                            onClick={() => handleUniversitySelect(university)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            <div className="font-medium">{university.name}</div>
                            <div className="text-gray-500 text-xs">
                              {university.country}
                              {university.province && `, ${university.province}`}
                              {university.state && `, ${university.state}`}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          No universities found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Major Selection (only for university category) */}
            {fileCategory === 'university' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Major/Program *
                </label>
                <select
                  value={formData.majorName}
                  onChange={(e) => handleInputChange('majorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a major/program</option>
                  {majorOptions.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;

