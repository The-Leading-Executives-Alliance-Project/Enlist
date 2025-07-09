import React, { useState } from 'react';
import { ChevronRightIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const Form = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        dateOfBirth: '',
        nationality: '',
        gender: '',
        countryOfResidence: '',
        phoneNumber: '',
        districtCode: '',

        // Step 2: School Academic Details
        schoolCountry: '',
        schoolProvince: '',
        schoolCity: '',
        currentGrade: '',
        graduationDate: '',
        gpa: '',

        // Step 3: Study Destination
        preferredCountries: [],
        preferredMajor: '',

        // Step 4: Standardized Tests
        academicProgram: '',
        ibScore: '',
        apScores: [],
        aLevelScores: [],
        toeflScore: '',
        ieltsListening: '',
        ieltsReading: '',
        ieltsSpeaking: '',
        ieltsWriting: '',
        satReading: '',
        satGrammar: '',
        satMath: '',
        actEnglish: '',
        actMath: '',
        actReading: '',
        actScience: ''
    });

    const [newApCourse, setNewApCourse] = useState('');
    const [newApScore, setNewApScore] = useState('');
    const [newALevelCourse, setNewALevelCourse] = useState('');
    const [newALevelScore, setNewALevelScore] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCountryChange = (country) => {
        const updatedCountries = formData.preferredCountries.includes(country)
            ? formData.preferredCountries.filter(c => c !== country)
            : [...formData.preferredCountries, country];
        handleInputChange('preferredCountries', updatedCountries);
    };

    const addApScore = () => {
        if (newApCourse && newApScore) {
            setFormData(prev => ({
                ...prev,
                apScores: [...prev.apScores, { course: newApCourse, score: newApScore }]
            }));
            setNewApCourse('');
            setNewApScore('');
        }
    };

    const removeApScore = (index) => {
        setFormData(prev => ({
            ...prev,
            apScores: prev.apScores.filter((_, i) => i !== index)
        }));
    };

    const addALevelScore = () => {
        if (newALevelCourse && newALevelScore) {
            setFormData(prev => ({
                ...prev,
                aLevelScores: [...prev.aLevelScores, { course: newALevelCourse, score: newALevelScore }]
            }));
            setNewALevelCourse('');
            setNewALevelScore('');
        }
    };

    const removeALevelScore = (index) => {
        setFormData(prev => ({
            ...prev,
            aLevelScores: prev.aLevelScores.filter((_, i) => i !== index)
        }));
    };

    const isStepValid = (step) => {
        switch (step) {
            case 1:
                return formData.dateOfBirth && formData.nationality && formData.gender &&
                    formData.countryOfResidence && formData.phoneNumber && formData.districtCode;
            case 2:
                return formData.schoolCountry && formData.schoolProvince && formData.schoolCity &&
                    formData.currentGrade && formData.graduationDate && formData.gpa;
            case 3:
                return formData.preferredCountries.length > 0 && formData.preferredMajor;
            case 4:
                if (!formData.academicProgram) return false;
                switch (formData.academicProgram) {
                    case 'IB':
                        return formData.ibScore !== '';
                    case 'AP':
                        return formData.apScores.length > 0;
                    case 'A-Level':
                        return formData.aLevelScores.length > 0;
                    case 'TOEFL':
                        return formData.toeflScore !== '';
                    case 'IELTS':
                        return formData.ieltsListening && formData.ieltsReading &&
                            formData.ieltsSpeaking && formData.ieltsWriting;
                    case 'SAT':
                        return formData.satReading && formData.satGrammar && formData.satMath;
                    case 'ACT':
                        return formData.actEnglish && formData.actMath &&
                            formData.actReading && formData.actScience;
                    default:
                        return false;
                }
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (isStepValid(currentStep) && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        if (isStepValid(4)) {
            console.log('Form submitted:', formData);
            // Handle form submission here
        }
    };

    const renderStepIndicator = () => (
        <div className="flex justify-center space-x-2 mt-8">
            {[1, 2, 3, 4].map((step) => (
                <div
                    key={step}
                    className={`w-4 h-4 rounded-full ${step === currentStep
                        ? 'bg-blue-600'
                        : step < currentStep
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                />
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality/Citizenship *
                    </label>
                    <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your nationality"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                    </label>
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
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country of Residence *
                    </label>
                    <input
                        type="text"
                        value={formData.countryOfResidence}
                        onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your country of residence"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        District Code *
                    </label>
                    <input
                        type="text"
                        value={formData.districtCode}
                        onChange={(e) => handleInputChange('districtCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter district code"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">School Academic Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Country *
                    </label>
                    <input
                        type="text"
                        value={formData.schoolCountry}
                        onChange={(e) => handleInputChange('schoolCountry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school country"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Province *
                    </label>
                    <input
                        type="text"
                        value={formData.schoolProvince}
                        onChange={(e) => handleInputChange('schoolProvince', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school province"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        School City *
                    </label>
                    <input
                        type="text"
                        value={formData.schoolCity}
                        onChange={(e) => handleInputChange('schoolCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school city"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Grade *
                    </label>
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
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intended Graduation Date *
                    </label>
                    <input
                        type="date"
                        value={formData.graduationDate}
                        onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        GPA *
                    </label>
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
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Study Destination</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Countries *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['US', 'Canada', 'Britain', 'Australia'].map((country) => (
                            <label key={country} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.preferredCountries.includes(country)}
                                    onChange={() => handleCountryChange(country)}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">{country}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Major *
                    </label>
                    <select
                        value={formData.preferredMajor}
                        onChange={(e) => handleInputChange('preferredMajor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select major</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Law">Law</option>
                        <option value="Arts">Arts</option>
                        <option value="Sciences">Sciences</option>
                        <option value="Social Sciences">Social Sciences</option>
                        <option value="Education">Education</option>
                        <option value="Architecture">Architecture</option>
                        <option value="Design">Design</option>
                        <option value="Communications">Communications</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Economics">Economics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Environmental Science">Environmental Science</option>
                        <option value="Political Science">Political Science</option>
                        <option value="History">History</option>
                        <option value="Literature">Literature</option>
                        <option value="Philosophy">Philosophy</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Standardized Tests</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Program *
                    </label>
                    <select
                        value={formData.academicProgram}
                        onChange={(e) => handleInputChange('academicProgram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select academic program</option>
                        <option value="IB">IB</option>
                        <option value="AP">AP</option>
                        <option value="A-Level">A-Level</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="IELTS">IELTS</option>
                        <option value="SAT">SAT</option>
                        <option value="ACT">ACT</option>
                    </select>
                </div>

                {formData.academicProgram === 'IB' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            IB Score *
                        </label>
                        <select
                            value={formData.ibScore}
                            onChange={(e) => handleInputChange('ibScore', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select IB score</option>
                            <option value="Not available">Not available</option>
                            {Array.from({ length: 46 }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>
                    </div>
                )}

                {formData.academicProgram === 'AP' && (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            AP Scores *
                        </label>

                        {formData.apScores.map((score, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium">{score.course}: {score.score}</span>
                                <button
                                    type="button"
                                    onClick={() => removeApScore(index)}
                                    className="ml-auto text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="flex space-x-2">
                            <select
                                value={newApCourse}
                                onChange={(e) => setNewApCourse(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select AP course</option>
                                <option value="AP Calculus AB">AP Calculus AB</option>
                                <option value="AP Calculus BC">AP Calculus BC</option>
                                <option value="AP Statistics">AP Statistics</option>
                                <option value="AP Biology">AP Biology</option>
                                <option value="AP Chemistry">AP Chemistry</option>
                                <option value="AP Physics">AP Physics</option>
                                <option value="AP English Literature">AP English Literature</option>
                                <option value="AP English Language">AP English Language</option>
                                <option value="AP US History">AP US History</option>
                                <option value="AP World History">AP World History</option>
                                <option value="AP European History">AP European History</option>
                                <option value="AP Government">AP Government</option>
                                <option value="AP Economics">AP Economics</option>
                                <option value="AP Psychology">AP Psychology</option>
                                <option value="AP Computer Science">AP Computer Science</option>
                                <option value="AP Environmental Science">AP Environmental Science</option>
                            </select>

                            <select
                                value={newApScore}
                                onChange={(e) => setNewApScore(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select score</option>
                                {[1, 2, 3, 4, 5].map(score => (
                                    <option key={score} value={score}>{score}</option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={addApScore}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

                {formData.academicProgram === 'A-Level' && (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            A-Level Scores *
                        </label>

                        {formData.aLevelScores.map((score, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium">{score.course}: {score.score}</span>
                                <button
                                    type="button"
                                    onClick={() => removeALevelScore(index)}
                                    className="ml-auto text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="flex space-x-2">
                            <select
                                value={newALevelCourse}
                                onChange={(e) => setNewALevelCourse(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select A-Level course</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Further Mathematics">Further Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="English Literature">English Literature</option>
                                <option value="English Language">English Language</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                                <option value="Economics">Economics</option>
                                <option value="Business Studies">Business Studies</option>
                                <option value="Psychology">Psychology</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Art">Art</option>
                                <option value="Music">Music</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Spanish">Spanish</option>
                            </select>

                            <select
                                value={newALevelScore}
                                onChange={(e) => setNewALevelScore(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select grade</option>
                                <option value="A*">A*</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="U">U</option>
                            </select>

                            <button
                                type="button"
                                onClick={addALevelScore}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

                {formData.academicProgram === 'TOEFL' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            TOEFL Score *
                        </label>
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
                    </div>
                )}

                {formData.academicProgram === 'IELTS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Listening Score *
                            </label>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reading Score *
                            </label>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speaking Score *
                            </label>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Writing Score *
                            </label>
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
                        </div>
                    </div>
                )}

                {formData.academicProgram === 'SAT' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reading Score *
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="400"
                                value={formData.satReading}
                                onChange={(e) => handleInputChange('satReading', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grammar Score *
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="400"
                                value={formData.satGrammar}
                                onChange={(e) => handleInputChange('satGrammar', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Math Score *
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="800"
                                value={formData.satMath}
                                onChange={(e) => handleInputChange('satMath', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0-800"
                                required
                            />
                        </div>
                    </div>
                )}

                {formData.academicProgram === 'ACT' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                English Score *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="36"
                                value={formData.actEnglish}
                                onChange={(e) => handleInputChange('actEnglish', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1-36"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Math Score *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="36"
                                value={formData.actMath}
                                onChange={(e) => handleInputChange('actMath', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1-36"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reading Score *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="36"
                                value={formData.actReading}
                                onChange={(e) => handleInputChange('actReading', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1-36"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Science Score *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="36"
                                value={formData.actScience}
                                onChange={(e) => handleInputChange('actScience', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1-36"
                                required
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            case 4:
                return renderStep4();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Step {currentStep}: {currentStep === 1 ? 'Personal Information' :
                                currentStep === 2 ? 'School Academic Details' :
                                    currentStep === 3 ? 'Study Destination' : 'Standardized Tests'}
                        </h1>
                        <p className="text-gray-600">Please fill in all required fields marked with *</p>
                    </div>

                    <div className="relative">
                        {renderCurrentStep()}

                        {/* Navigation Arrow */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!isStepValid(currentStep)}
                                    className={`flex flex-col items-center p-4 rounded-full shadow-lg transition-all duration-200 ${isStepValid(currentStep)
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronRightIcon className="h-6 w-6" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStepValid(currentStep)}
                                    className={`flex flex-col items-center p-4 rounded-full shadow-lg transition-all duration-200 ${isStepValid(currentStep)
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowUpIcon className="h-6 w-6" />
                                    <span className="text-xs mt-1">Submit</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {renderStepIndicator()}
                </div>
            </div>
        </div>
    );
};

export default Form; 