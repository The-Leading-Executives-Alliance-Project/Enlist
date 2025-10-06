import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineDown, AiOutlineRight, AiOutlinePlus } from 'react-icons/ai';
import DocumentForm from '../components/DocumentForm';
import api from '../services/api';

const Document = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(new Set());
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formCategory, setFormCategory] = useState('personal');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggle = (id) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    const clickEssay = (id) => {
        navigate(`/document/edition/${id}`);
    };

    const handleAddDocument = (category) => {
        setFormCategory(category);
        setShowForm(true);
    };

    const handleSaveDocument = async (documentData) => {
        try {
            await api.post('/documents', documentData);
            await fetchDocuments();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating document:', error);
            alert('Error creating document. Please try again.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    // Group documents by category and university
    const groupedDocuments = documents.reduce((acc, doc) => {
        if (doc.fileCategory === 'personal') {
            if (!acc.personal) acc.personal = [];
            acc.personal.push(doc);
        } else if (doc.fileCategory === 'university') {
            const key = `${doc.universityName} - ${doc.majorName}`;
            if (!acc.universities) acc.universities = {};
            if (!acc.universities[key]) acc.universities[key] = [];
            acc.universities[key].push(doc);
        }
        return acc;
    }, {});

    const getStatusIcon = (doc) => {
        // You can implement status logic based on your needs
        // For now, showing based on whether essay content exists
        return doc.essay && doc.essay.length > 0 ? 
            <AiOutlineCheckCircle className="text-green-500" size={20} /> : 
            <AiOutlineCloseCircle className="text-red-500" size={20} />;
    };

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Loading documents...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Essay Dashboard</h1>

            {/* Personal Essays Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Essays</h2>
                {groupedDocuments.personal && groupedDocuments.personal.length > 0 ? (
                    <>
                        {groupedDocuments.personal.map(doc => (
                            <div
                                key={doc._id}
                                onClick={() => clickEssay(doc._id)}
                                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer mb-2"
                            >
                                <span className="text-lg font-medium text-gray-700">{doc.documentName}</span>
                                {getStatusIcon(doc)}
                            </div>
                        ))}
                        {/* Plus sign for adding new personal document */}
                        <div
                            onClick={() => handleAddDocument('personal')}
                            className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <AiOutlinePlus className="text-gray-400" size={24} />
                            <span className="ml-2 text-gray-500">Add Personal Document</span>
                        </div>
                    </>
                ) : (
                    <div
                        onClick={() => handleAddDocument('personal')}
                        className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <AiOutlinePlus className="text-gray-400" size={24} />
                        <span className="ml-2 text-gray-500">Add Your First Personal Document</span>
                    </div>
                )}
            </div>

            {/* University Essays Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">University Essays</h2>
                {groupedDocuments.universities && Object.keys(groupedDocuments.universities).length > 0 ? (
                    <>
                        {Object.entries(groupedDocuments.universities).map(([universityKey, universityDocs]) => (
                            <div key={universityKey} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                                <div
                                    onClick={() => toggle(universityKey)}
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                >
                                    <h3 className="text-lg font-medium text-gray-700">{universityKey}</h3>
                                    {expanded.has(universityKey) ? <AiOutlineDown size={20} /> : <AiOutlineRight size={20} />}
                                </div>

                                {expanded.has(universityKey) && (
                                    <div className="border-t border-gray-200">
                                        {universityDocs.map(doc => (
                                            <div
                                                key={doc._id}
                                                onClick={() => clickEssay(doc._id)}
                                                className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <span className="text-base text-gray-600">{doc.documentName}</span>
                                                {getStatusIcon(doc)}
                                            </div>
                                        ))}
                                        {/* Plus sign for adding new document to this university */}
                                        <div
                                            onClick={() => handleAddDocument('university')}
                                            className="flex items-center justify-center p-3 pl-8 bg-gray-50 border-t border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <AiOutlinePlus className="text-gray-400" size={20} />
                                            <span className="ml-2 text-gray-500 text-sm">Add Document</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Plus sign for adding new university */}
                        <div
                            onClick={() => handleAddDocument('university')}
                            className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <AiOutlinePlus className="text-gray-400" size={24} />
                            <span className="ml-2 text-gray-500">Add New University Document</span>
                        </div>
                    </>
                ) : (
                    <div
                        onClick={() => handleAddDocument('university')}
                        className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <AiOutlinePlus className="text-gray-400" size={24} />
                        <span className="ml-2 text-gray-500">Add Your First University Document</span>
                    </div>
                )}
            </div>

            {showForm && (
                <DocumentForm
                    onSave={handleSaveDocument}
                    onCancel={handleCancelForm}
                    fileCategory={formCategory}
                />
            )}
        </div>
    );
};

export default Document; 