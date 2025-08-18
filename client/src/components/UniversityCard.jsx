import React from 'react';

const UniversityCard = ({ program, university, location, cost, match, isNew, onAddToCompare, onViewProgram }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex justify-between items-center">
      {/* Left Section: Program, University, Location, Add to Compare */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{program}</h3>
        <div className="flex items-center mb-3">
          {/* Placeholder for University Logo - you might replace this with an actual image */}
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
            U
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">{university}</p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
        <button
          onClick={onAddToCompare}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <span className="mr-1">+</span> Add to Compare
        </button>
      </div>

      {/* Right Section: Tags, Cost, View Program */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2 mb-2">
          {isNew && (
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
              New
            </span>
          )}
          {match && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Match: {match}%
            </span>
          )}
          {/* Bookmark Icon */}
          <svg className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm-1 9v-1h12v1H4z"></path></svg>
        </div>
        <p className="text-2xl font-bold text-gray-800">{cost}</p>
        <button
          onClick={onViewProgram}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          View Program <span className="ml-1">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default UniversityCard; 