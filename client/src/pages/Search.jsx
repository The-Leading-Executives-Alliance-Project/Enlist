import React, { useState } from 'react';
import { UserProfileService, UniversityService } from '../services/api';
import UniversityCard from '../components/UniversityCard';

const Search = () => {
    const [searchData, setSearchData] = useState({
        major: '',
        country: '',
        city: '',
        cost: '',
        other: ''
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // 使用真实的API调用搜索大学
            const response = await UniversityService.search(searchData);
            setResults(response.universities || []);
            if ((response.universities || []).length === 0) {
                setMessage('No universities found matching your criteria.');
            }
        } catch (error) {
            console.error('Error searching universities:', error);
            setMessage('Failed to search universities. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Function to add sample data (for testing UI)
    const addSampleData = () => {
        setResults([
            {
                _id: '1',
                program: 'Engineering',
                university: 'York University',
                location: 'Toronto, ON',
                cost: '$11,256 / yr',
                match: 78,
                isNew: true,
                website: 'http://yorku.ca'
            },
            {
                _id: '2',
                program: 'Commerce',
                university: 'York University',
                location: 'Toronto, ON',
                cost: '$11,164 / yr',
                match: 78,
                isNew: true,
                website: 'http://yorku.ca'
            },
            {
                _id: '3',
                program: 'Software Engineering',
                university: 'University of Waterloo',
                location: 'Waterloo, ON',
                cost: '$20,500 / yr',
                match: 78,
                isNew: true,
                website: 'http://uwaterloo.ca'
            },
            {
                _id: '4',
                program: 'Computer Science',
                university: 'University of Toronto',
                location: 'Toronto, ON',
                cost: '$15,000 / yr',
                match: 85,
                isNew: false,
                website: 'http://utoronto.ca'
            },
            {
                _id: '5',
                program: 'Business Administration',
                university: 'Western University',
                location: 'London, ON',
                cost: '$18,000 / yr',
                match: 72,
                isNew: true,
                website: 'http://uwo.ca'
            }
        ]);
        setMessage('Sample data loaded successfully!');
    };

    const handleAddToCompare = (id) => {
        console.log(`Add university ${id} to compare`);
        // TODO: Implement logic to add to compare list
        setMessage(`Added university ${id} to compare list`);
    };

    const handleViewProgram = (website) => {
        if (website) {
            window.open(website, '_blank');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Top Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Search for universities, programs..."
                    className="flex-grow outline-none text-gray-700"
                    value={searchData.major}
                    onChange={(e) => setSearchData(prev => ({ ...prev, major: e.target.value }))}
                />
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative inline-block text-left">
                    <select
                        name="major"
                        value={searchData.major}
                        onChange={handleInputChange}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <option value="">Discipline</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                    </select>
                </div>
                <div className="relative inline-block text-left">
                    <select
                        name="country"
                        value={searchData.country}
                        onChange={handleInputChange}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <option value="">Province</option>
                        <option value="ON">Ontario</option>
                        <option value="BC">British Columbia</option>
                        <option value="AB">Alberta</option>
                        <option value="QC">Quebec</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="MB">Manitoba</option>
                        <option value="SK">Saskatchewan</option>
                    </select>
                </div>
                <div className="relative inline-block text-left">
                    <select
                        name="city"
                        value={searchData.city}
                        onChange={handleInputChange}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <option value="">City</option>
                        <option value="Toronto">Toronto</option>
                        <option value="Waterloo">Waterloo</option>
                        <option value="London">London</option>
                        <option value="Vancouver">Vancouver</option>
                        <option value="Montreal">Montreal</option>
                        <option value="Calgary">Calgary</option>
                        <option value="Ottawa">Ottawa</option>
                    </select>
                </div>
                <div className="relative inline-block text-left">
                    <select
                        name="cost"
                        value={searchData.cost}
                        onChange={handleInputChange}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <option value="">Cost</option>
                        <option value="<15000">Less than $15,000</option>
                        <option value="15000-25000">$15,000 - $25,000</option>
                        <option value="25000-35000">$25,000 - $35,000</option>
                        <option value=">35000">More than $35,000</option>
                    </select>
                </div>
                <div className="relative inline-block text-left">
                    <select
                        name="other"
                        value={searchData.other}
                        onChange={handleInputChange}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <option value="">Other</option>
                        <option value="online">Online Programs</option>
                        <option value="coop">Co-op Available</option>
                        <option value="scholarship">Scholarships Available</option>
                        <option value="international">International Students Welcome</option>
                    </select>
                </div>
            </div>

            {/* Search Button and Sample Data Button */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search Universities'}
                </button>
                <button
                    onClick={addSampleData}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition-colors"
                >
                    Add Sample Data
                </button>
            </div>

            {/* Message Area */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${
                    message.includes('Error') || message.includes('Failed') 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                }`}>
                    {message}
                </div>
            )}

            {/* Search Results */}
            <div className="space-y-4">
                {results.length > 0 ? (
                    results.map((uni) => (
                        <UniversityCard
                            key={uni._id}
                            program={uni.program}
                            university={uni.university}
                            location={uni.location}
                            cost={uni.cost}
                            match={uni.match}
                            isNew={uni.isNew}
                            onAddToCompare={() => handleAddToCompare(uni._id)}
                            onViewProgram={() => handleViewProgram(uni.website)}
                        />
                    ))
                ) : (
                    !loading && !message && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <p className="text-gray-500 text-lg">Start by searching or adding sample data.</p>
                            <p className="text-gray-400 text-sm mt-2">Use the search bar above or click "Add Sample Data" to see results.</p>
                        </div>
                    )
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Searching universities...</p>
                </div>
            )}
        </div>
    );
};

export default Search; 