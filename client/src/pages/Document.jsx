import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineDown, AiOutlineRight } from 'react-icons/ai';

const Document = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(new Set());

    const personalEssays = [
        { id: 'personal-statement', title: 'Personal Statement', done: false }
    ];

    const universityEssays = [
        {
            id: 'ubc-sauder',
            name: 'UBC - Sauder',
            essays: [
                { id: 'why-ubc', title: 'Why UBC', done: false },
                { id: 'why-sauder', title: 'Why Sauder', done: false }
            ]
        },
        {
            id: 'sfu-beedie',
            name: 'SFU - Beedie',
            essays: [
                { id: 'why-sfu', title: 'Why SFU', done: false },
                { id: 'why-beedie', title: 'Why Beedie', done: false }
            ]
        }
    ];

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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Essay Dashboard</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Essays</h2>
                {personalEssays.map(essay => (
                    <div
                        key={essay.id}
                        onClick={() => clickEssay(essay.id)}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <span className="text-lg font-medium text-gray-700">{essay.title}</span>
                        {essay.done ? <AiOutlineCheckCircle className="text-green-500" size={20} /> : <AiOutlineCloseCircle className="text-red-500" size={20} />}
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">University Essays</h2>
                {universityEssays.map(university => (
                    <div key={university.id} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div
                            onClick={() => toggle(university.id)}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        >
                            <h3 className="text-lg font-medium text-gray-700">{university.name}</h3>
                            {expanded.has(university.id) ? <AiOutlineDown size={20} /> : <AiOutlineRight size={20} />}
                        </div>

                        {expanded.has(university.id) && (
                            <div className="border-t border-gray-200">
                                {university.essays.map(essay => (
                                    <div
                                        key={essay.id}
                                        onClick={() => clickEssay(essay.id)}
                                        className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <span className="text-base text-gray-600">{essay.title}</span>
                                        {essay.done ? <AiOutlineCheckCircle className="text-green-500" size={20} /> : <AiOutlineCloseCircle className="text-red-500" size={20} />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Document; 