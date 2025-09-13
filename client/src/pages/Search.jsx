import React, { useState, useEffect } from "react";
import { SearchService } from "../services/api";
import UniversityCard from "../components/UniversityCard";

const Search = () => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    discipline: "",
    province: "",
    city: "",
    cost: "",
    other: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadUniversities = async () => {
    setLoading(true);
    try {
      const response = await SearchService.getAllUniversities();

      const formattedData = formateData(response);

      setResults(formattedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    loadUniversities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log(" Sending search query:", searchData);
      const response = await SearchService.search(searchData);
      const formatedData = formateData(response);
      setResults(formatedData || []);
      if ((response.data || []).length === 0) {
        setMessage("No universities found matching your criteria.");
      }
    } catch (error) {
      console.error("Error searching universities:", error);
      setMessage("Failed to search universities. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formateData = (resp) => {
    const result = [];
    resp.data.forEach((uni) => {
      if ((uni.majors && uni.majors.length > 0)) {
        uni.majors.forEach((major) => {
          result.push({
            _id: `${uni._id}_${major.name}`,
            program: major.name,
            university: uni.name,
            location: `${uni.city},${uni.province}`,
            cost: uni.tuition?.domestic || "N/A",
            match: Math.floor(Math.random() * 30) + 70, // need to be determined???
            isNew: Math.random() > 0.7, // need to be determined???
            website: uni.website || "#",
          });
        });
      }
    });
    return result;
  };

  const handleAddToCompare = (id) => {
    // TODO: Implement logic to add to compare list
    setMessage(`Added university ${id} to compare list`);
  };

  const handleViewProgram = (website) => {
    if (website) {
      window.open(website, "_blank");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center">
        <svg
          className="w-6 h-6 text-gray-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          type="text"
          placeholder="Search by college name, location, or major"
          className="flex-grow outline-none text-gray-700"
          value={searchData.keyword}
          onChange={(e) =>
            setSearchData((prev) => ({ ...prev, keyword: e.target.value }))
          }
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative inline-block text-left">
          <select
            name="discipline"
            value={searchData.discipline}
            onChange={handleInputChange}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <option value="">Discipline</option>
            <option value="Engineering">Engineering</option>
            <option value="Commerce">Commerce</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">
              Business Administration
            </option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
          </select>
        </div>
        <div className="relative inline-block text-left">
          <select
            name="province"
            value={searchData.province}
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
            <option value="international">
              International Students Welcome
            </option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Searching..." : "Search Universities"}
        </button>
      </div>

      {/* Message Area */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.includes("Error") || message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {results.length > 0
          ? results.map((uni) => (
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
          : !loading &&
            !message && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <p className="text-gray-500 text-lg">No universities found.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search criteria.
                </p>
              </div>
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
