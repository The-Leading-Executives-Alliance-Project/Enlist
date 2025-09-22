// src/components/ExperienceForm.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ExperienceForm = ({ experience, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    organization: '',
    coreValues: [],
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: ''
  });

  const coreValues = [
    { value: 'Authenticity', description: 'Shows self-awareness and genuine character' },
    { value: 'Curiosity', description: 'Demonstrates intellectual engagement and love of learning' },
    { value: 'Empathy', description: 'Reveals emotional intelligence and ability to connect with others' },
    { value: 'Leadership', description: 'Shows initiative and ability to create positive change' },
    { value: 'Resilience/Growth', description: 'Indicates ability to overcome challenges and learn from setbacks' },
    { value: 'Responsibility', description: 'Demonstrates maturity and accountability' },
    { value: 'Social Change', description: 'Shows commitment to making a meaningful impact' },
    { value: 'Courage', description: 'Reveals willingness to take risks and stand up for beliefs' },
    { value: 'Collaboration', description: 'Shows ability to work well with diverse groups' },
    { value: 'Purpose', description: 'Demonstrates direction and meaningful motivation' }
  ];

  useEffect(() => {
    if (experience && isEditing) {
      setFormData({
        organization: experience.organization || '',
        coreValues: experience.coreValues || [],
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        current: experience.current || false,
        description: experience.description || '',
        location: experience.location || ''
      });
    }
  }, [experience, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoreValueChange = (value) => {
    setFormData(prev => {
      const currentValues = prev.coreValues;
      if (currentValues.includes(value)) {
        // Remove if already selected
        return {
          ...prev,
          coreValues: currentValues.filter(v => v !== value)
        };
      } else if (currentValues.length < 2) {
        // Add if less than 2 selected
        return {
          ...prev,
          coreValues: [...currentValues, value]
        };
      }
      // Don't add if already 2 selected
      return prev;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.organization || formData.coreValues.length === 0 || !formData.startDate) {
      alert('Please fill in all required fields');
      return;
    }

    // If not current, endDate is required
    if (!formData.current && !formData.endDate) {
      alert('Please provide an end date or mark as current');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/Company *
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Google, Local Hospital, School Club"
                  required
                />
              </div>

              {/* Core Values */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Core Values * (Select 1-2)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coreValues.map((coreValue) => (
                    <div key={coreValue.value} className="relative group">
                      <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.coreValues.includes(coreValue.value)}
                          onChange={() => handleCoreValueChange(coreValue.value)}
                          disabled={!formData.coreValues.includes(coreValue.value) && formData.coreValues.length >= 2}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {coreValue.value}
                        </span>
                      </label>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 w-64">
                        {coreValue.description}
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {formData.coreValues.length}/2
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={formData.current}
                />
              </div>
            </div>

            {/* Current Position */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => handleInputChange('current', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                I am currently working/volunteering here
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your role, responsibilities, and achievements..."
              />
            </div>


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
                {isEditing ? 'Update Experience' : 'Add Experience'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;
