import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { Country, State } from 'country-state-city';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '../services/api'; // Added import for api

const Form = ({ onFormComplete }) => {
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
        collegeTest: '', // SAT, ACT, or Neither
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
        actScience: '',
        englishTest: '' // TOEFL, IELTS, or Neither
    });

    const [newApCourse, setNewApCourse] = useState('');
    const [newApScore, setNewApScore] = useState('');
    const [newALevelCourse, setNewALevelCourse] = useState('');
    const [newALevelScore, setNewALevelScore] = useState('');

    // Country and state data
    const countryOptions = Country.getAllCountries().map(country => ({
        value: country.isoCode,
        label: country.name
    })).sort((a, b) => a.label.localeCompare(b.label));

    const [stateOptions, setStateOptions] = useState([]);

    // Update state options when country changes
    useEffect(() => {
        if (formData.schoolCountry) {
            const states = State.getStatesOfCountry(formData.schoolCountry);
            const stateOptions = states.map(state => ({
                value: state.isoCode,
                label: state.name
            }));
            setStateOptions(stateOptions);
        } else {
            setStateOptions([]);
        }
    }, [formData.schoolCountry]);

    const majorOptions = [
        { value: 'Not decided', label: 'Not decided' },
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Software Engineering', label: 'Software Engineering' },
        { value: 'Information Technology', label: 'Information Technology' },
        { value: 'Data Science', label: 'Data Science' },
        { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
        { value: 'Cybersecurity', label: 'Cybersecurity' },
        { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
        { value: 'Electrical Engineering', label: 'Electrical Engineering' },
        { value: 'Civil Engineering', label: 'Civil Engineering' },
        { value: 'Chemical Engineering', label: 'Chemical Engineering' },
        { value: 'Biomedical Engineering', label: 'Biomedical Engineering' },
        { value: 'Aerospace Engineering', label: 'Aerospace Engineering' },
        { value: 'Environmental Engineering', label: 'Environmental Engineering' },
        { value: 'Business Administration', label: 'Business Administration' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Accounting', label: 'Accounting' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Economics', label: 'Economics' },
        { value: 'International Business', label: 'International Business' },
        { value: 'Human Resources', label: 'Human Resources' },
        { value: 'Supply Chain Management', label: 'Supply Chain Management' },
        { value: 'Medicine', label: 'Medicine' },
        { value: 'Nursing', label: 'Nursing' },
        { value: 'Pharmacy', label: 'Pharmacy' },
        { value: 'Dentistry', label: 'Dentistry' },
        { value: 'Veterinary Medicine', label: 'Veterinary Medicine' },
        { value: 'Physiotherapy', label: 'Physiotherapy' },
        { value: 'Occupational Therapy', label: 'Occupational Therapy' },
        { value: 'Law', label: 'Law' },
        { value: 'Criminal Justice', label: 'Criminal Justice' },
        { value: 'Political Science', label: 'Political Science' },
        { value: 'International Relations', label: 'International Relations' },
        { value: 'Psychology', label: 'Psychology' },
        { value: 'Sociology', label: 'Sociology' },
        { value: 'Anthropology', label: 'Anthropology' },
        { value: 'Social Work', label: 'Social Work' },
        { value: 'Education', label: 'Education' },
        { value: 'Teaching', label: 'Teaching' },
        { value: 'Special Education', label: 'Special Education' },
        { value: 'Architecture', label: 'Architecture' },
        { value: 'Interior Design', label: 'Interior Design' },
        { value: 'Urban Planning', label: 'Urban Planning' },
        { value: 'Graphic Design', label: 'Graphic Design' },
        { value: 'Industrial Design', label: 'Industrial Design' },
        { value: 'Fashion Design', label: 'Fashion Design' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Journalism', label: 'Journalism' },
        { value: 'Public Relations', label: 'Public Relations' },
        { value: 'Media Studies', label: 'Media Studies' },
        { value: 'Film Studies', label: 'Film Studies' },
        { value: 'Theater Arts', label: 'Theater Arts' },
        { value: 'Music', label: 'Music' },
        { value: 'Music Performance', label: 'Music Performance' },
        { value: 'Music Composition', label: 'Music Composition' },
        { value: 'Visual Arts', label: 'Visual Arts' },
        { value: 'Fine Arts', label: 'Fine Arts' },
        { value: 'Photography', label: 'Photography' },
        { value: 'Digital Arts', label: 'Digital Arts' },
        { value: 'Animation', label: 'Animation' },
        { value: 'Game Design', label: 'Game Design' },
        { value: 'Mathematics', label: 'Mathematics' },
        { value: 'Statistics', label: 'Statistics' },
        { value: 'Applied Mathematics', label: 'Applied Mathematics' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry', label: 'Chemistry' },
        { value: 'Biology', label: 'Biology' },
        { value: 'Biochemistry', label: 'Biochemistry' },
        { value: 'Microbiology', label: 'Microbiology' },
        { value: 'Genetics', label: 'Genetics' },
        { value: 'Neuroscience', label: 'Neuroscience' },
        { value: 'Environmental Science', label: 'Environmental Science' },
        { value: 'Geology', label: 'Geology' },
        { value: 'Oceanography', label: 'Oceanography' },
        { value: 'Meteorology', label: 'Meteorology' },
        { value: 'Astronomy', label: 'Astronomy' },
        { value: 'Zoology', label: 'Zoology' },
        { value: 'Botany', label: 'Botany' },
        { value: 'Marine Biology', label: 'Marine Biology' },
        { value: 'Wildlife Biology', label: 'Wildlife Biology' },
        { value: 'Conservation Biology', label: 'Conservation Biology' },
        { value: 'Forestry', label: 'Forestry' },
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Horticulture', label: 'Horticulture' },
        { value: 'Food Science', label: 'Food Science' },
        { value: 'Nutrition', label: 'Nutrition' },
        { value: 'Dietetics', label: 'Dietetics' },
        { value: 'Kinesiology', label: 'Kinesiology' },
        { value: 'Sports Science', label: 'Sports Science' },
        { value: 'Physical Education', label: 'Physical Education' },
        { value: 'History', label: 'History' },
        { value: 'Art History', label: 'Art History' },
        { value: 'Archaeology', label: 'Archaeology' },
        { value: 'Classical Studies', label: 'Classical Studies' },
        { value: 'Philosophy', label: 'Philosophy' },
        { value: 'Religious Studies', label: 'Religious Studies' },
        { value: 'Linguistics', label: 'Linguistics' },
        { value: 'English Literature', label: 'English Literature' },
        { value: 'Creative Writing', label: 'Creative Writing' },
        { value: 'Comparative Literature', label: 'Comparative Literature' },
        { value: 'French', label: 'French' },
        { value: 'Spanish', label: 'Spanish' },
        { value: 'German', label: 'German' },
        { value: 'Italian', label: 'Italian' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Japanese', label: 'Japanese' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Arabic', label: 'Arabic' },
        { value: 'Russian', label: 'Russian' },
        { value: 'Portuguese', label: 'Portuguese' },
        { value: 'Translation Studies', label: 'Translation Studies' },
        { value: 'Hospitality Management', label: 'Hospitality Management' },
        { value: 'Tourism Management', label: 'Tourism Management' },
        { value: 'Event Management', label: 'Event Management' },
        { value: 'Culinary Arts', label: 'Culinary Arts' },
        { value: 'Aviation', label: 'Aviation' },
        { value: 'Aeronautical Engineering', label: 'Aeronautical Engineering' },
        { value: 'Maritime Studies', label: 'Maritime Studies' },
        { value: 'Military Science', label: 'Military Science' },
        { value: 'Criminalistics', label: 'Criminalistics' },
        { value: 'Forensic Science', label: 'Forensic Science' },
        { value: 'Library Science', label: 'Library Science' },
        { value: 'Information Studies', label: 'Information Studies' },
        { value: 'Public Health', label: 'Public Health' },
        { value: 'Epidemiology', label: 'Epidemiology' },
        { value: 'Global Health', label: 'Global Health' },
        { value: 'Health Administration', label: 'Health Administration' },
        { value: 'Other', label: 'Other' }
    ];

    const aLevelCourses = [
        "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Business", "Accounting",
        "Computer Science", "English Literature", "History", "Geography", "Psychology", "Sociology", "Art and Design"
    ];
    const aLevelScores = ["A*", "A", "B", "C", "D", "E", "U"];

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
                    formData.countryOfResidence && formData.phoneNumber;
            case 2:
                return formData.schoolCountry && formData.schoolProvince && formData.schoolCity &&
                    formData.currentGrade && formData.graduationDate && formData.gpa;
            case 3:
                return formData.preferredCountries.length > 0 && formData.preferredMajor;
            case 4:
                // Accept 'None' as a valid academic program
                const hasAcademicProgram =
                    formData.academicProgram &&
                    (
                        formData.academicProgram === 'None' ||
                        (formData.academicProgram === 'IB' && formData.ibScore !== '') ||
                        (formData.academicProgram === 'AP' && formData.apScores.length > 0) ||
                        (formData.academicProgram === 'A-Level' && formData.aLevelScores.length > 0)
                    );

                // Check college test scores if selected
                const hasCollegeTest = formData.collegeTest === 'Neither' ||
                    (formData.collegeTest === 'SAT' && formData.satReading && formData.satGrammar && formData.satMath) ||
                    (formData.collegeTest === 'ACT' && formData.actEnglish && formData.actMath && formData.actReading && formData.actScience);

                // Check English test scores if selected
                const hasEnglishTest = formData.englishTest === 'Neither' ||
                    (formData.englishTest === 'TOEFL' && formData.toeflScore !== '') ||
                    (formData.englishTest === 'IELTS' && formData.ieltsListening && formData.ieltsReading &&
                        formData.ieltsSpeaking && formData.ieltsWriting);

                return hasAcademicProgram && hasCollegeTest && hasEnglishTest;
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

    const handleSubmit = async () => {
        if (isStepValid(4)) {
            try {
                const response = await api.post('/userprofile', formData);
                console.log('Profile submitted successfully:', response.data);
                
                // Call the callback to notify parent component
                if (onFormComplete) {
                    onFormComplete();
                }
                
                // Remove the alert since we're auto-rendering the profile
                // alert('Profile submitted successfully!');
            } catch (err) {
                if (err.response) {
                    console.error('Profile submission error:', err.response.data);
                    alert('Error: ' + (err.response.data.error || 'Unknown error'));
                } else {
                    console.error('Profile submission error:', err.message);
                    alert('Error: ' + err.message);
                }
            }
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
                    <Select
                        value={countryOptions.find(option => option.value === formData.nationality)}
                        onChange={(option) => handleInputChange('nationality', option ? option.value : '')}
                        options={countryOptions}
                        placeholder="Select your nationality"
                        isSearchable
                        className="w-full"
                        classNamePrefix="react-select"
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
                    <Select
                        value={countryOptions.find(option => option.value === formData.countryOfResidence)}
                        onChange={(option) => handleInputChange('countryOfResidence', option ? option.value : '')}
                        options={countryOptions}
                        placeholder="Select your country of residence"
                        isSearchable
                        className="w-full"
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <PhoneInput
                        country={'cn'}
                        value={formData.phoneNumber}
                        onChange={phone => handleInputChange('phoneNumber', phone)}
                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        inputProps={{ required: true, name: 'phone', autoFocus: false }}
                        enableSearch
                        disableDropdown={false}
                        masks={{ cn: '... .... ....', us: '(...) ...-....', ca: '(...) ...-....' }}
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
                    <Select
                        value={countryOptions.find(option => option.value === formData.schoolCountry)}
                        onChange={(option) => {
                            handleInputChange('schoolCountry', option ? option.value : '');
                            handleInputChange('schoolProvince', ''); // Reset province when country changes
                        }}
                        options={countryOptions}
                        placeholder="Select school country"
                        isSearchable
                        className="w-full"
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Province/State *
                    </label>
                    {formData.schoolCountry && stateOptions.length > 0 ? (
                        <Select
                            value={stateOptions.find(option => option.value === formData.schoolProvince)}
                            onChange={(option) => handleInputChange('schoolProvince', option ? option.value : '')}
                            options={stateOptions}
                            placeholder="Select school province/state"
                            isSearchable
                            className="w-full"
                            classNamePrefix="react-select"
                        />
                    ) : (
                        <input
                            type="text"
                            value={formData.schoolProvince}
                            onChange={(e) => handleInputChange('schoolProvince', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter school province/state"
                            required
                        />
                    )}
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
                        <option value="" style={{ color: '#9ca3af' }}>Select GPA</option>
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
                    <Select
                        value={majorOptions.find(option => option.value === formData.preferredMajor) || null}
                        onChange={(option) => handleInputChange('preferredMajor', option ? option.value : '')}
                        options={majorOptions}
                        placeholder="Select or search for your preferred major"
                        isSearchable
                        className="w-full"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Standardized Tests</h2>

            <div className="space-y-8">
                {/* Section 1: Academic Programs */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Academic Programs</h3>
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
                            <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select academic program</option>
                            <option value="IB">IB</option>
                            <option value="AP">AP</option>
                            <option value="A-Level">A-Level</option>
                            <option value="None">None of these</option>
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
                                <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select IB score</option>
                                <option value="Not available">Not available</option>
                                {Array.from({ length: 46 }, (_, i) => 45 - i).map(i => (
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
                                    <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select score</option>
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
                                    {aLevelCourses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                                <select
                                    value={newALevelScore}
                                    onChange={(e) => setNewALevelScore(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select score</option>
                                    {aLevelScores.map(score => (
                                        <option key={score} value={score}>{score}</option>
                                    ))}
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

                </div>

                {/* Section 2: College Admissions Tests */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">2. College Admissions Tests</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            College Admissions Test *
                        </label>
                        <select
                            value={formData.collegeTest}
                            onChange={(e) => handleInputChange('collegeTest', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select test</option>
                            <option value="SAT">SAT</option>
                            <option value="ACT">ACT</option>
                            <option value="Neither">Neither</option>
                        </select>
                    </div>

                    {formData.collegeTest === 'SAT' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

                    {formData.collegeTest === 'ACT' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                {/* Section 3: English Proficiency Tests */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">3. English Proficiency Tests</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            English Proficiency Test *
                        </label>
                        <select
                            value={formData.englishTest}
                            onChange={(e) => handleInputChange('englishTest', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select test</option>
                            <option value="TOEFL">TOEFL</option>
                            <option value="IELTS">IELTS</option>
                            <option value="Neither">Neither</option>
                        </select>
                    </div>

                    {formData.englishTest === 'TOEFL' && (
                        <div className="mt-4">
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

                    {formData.englishTest === 'IELTS' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                    <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select score</option>
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
                                    <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select score</option>
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
                                    <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select score</option>
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
                                    <option value="" disabled hidden style={{ color: '#9ca3af' }}>Select score</option>
                                    {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(score => (
                                        <option key={score} value={score}>{score}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
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
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex">
                {/* Back Button (left of form box) */}
                {currentStep > 1 && (
                    <button
                        onClick={prevStep}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center p-4 rounded-full shadow-lg transition-all duration-200 bg-gray-600 text-white hover:bg-gray-700 hover:scale-105 z-30"
                        style={{ marginLeft: '-4.5rem' }} // 1.5rem gap from form box (button is 6rem wide)
                        title="Previous Step"
                    >
                        <ChevronLeftIcon className="h-8 w-8" />
                        <span className="text-xs mt-1">Back</span>
                    </button>
                )}

                <div className="bg-white rounded-lg shadow-lg p-8 flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Step {currentStep}: {currentStep === 1 ? 'Personal Information' :
                                currentStep === 2 ? 'School Academic Details' :
                                    currentStep === 3 ? 'Study Destination' : 'Standardized Tests'}
                        </h1>
                        <p className="text-gray-600">Please fill in all required fields marked with *</p>
                    </div>
                    <div>
                        {renderCurrentStep()}
                    </div>
                </div>

                {/* Next/Submit Button (right of form box) */}
                <button
                    onClick={currentStep < 4 ? nextStep : handleSubmit}
                    disabled={!isStepValid(currentStep)}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center p-4 rounded-full shadow-lg transition-all duration-200 z-30 ${isStepValid(currentStep)
                        ? (currentStep < 4 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105' : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105')
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    style={{ marginRight: '-4.5rem' }} // 1.5rem gap from form box (button is 6rem wide)
                    title={isStepValid(currentStep) ? (currentStep < 4 ? "Next Step" : "Submit Form") : "Please complete all required fields"}
                >
                    {currentStep < 4 ? (
                        <>
                            <ChevronRightIcon className="h-8 w-8" />
                            <span className="text-xs mt-1">Next</span>
                        </>
                    ) : (
                        <>
                            <ArrowUpIcon className="h-8 w-8" />
                            <span className="text-xs mt-1">Submit</span>
                        </>
                    )}
                </button>
            </div>
            {/* Step Indicator below the form box */}
            <div className="mt-4 flex justify-center">
                {renderStepIndicator()}
            </div>
        </div>
    );
};

export default Form; 