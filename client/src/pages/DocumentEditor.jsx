import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const DocumentEditor = () => {
    const { essayId } = useParams();
    const [essay, setEssay] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hi! I am here to help you with your essay.' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { sender: 'user', text: input }]);
        setInput('');
    };

    const getTitle = () => {
        const titles = {
            'personal-statement': 'Personal Statement',
            'why-ubc': 'Why UBC',
            'why-sauder': 'Why Sauder',
            'why-sfu': 'Why SFU',
            'why-beedie': 'Why Beedie'
        };
        return titles[essayId] || 'Essay';
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-[80vh]">
            <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-gray-900">{getTitle()}</h2>
                <textarea
                    className="flex-1 w-full min-h-[400px] resize-y border border-gray-200 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                    placeholder="Start writing your essay here..."
                    value={essay}
                    onChange={e => setEssay(e.target.value)}
                />
            </div>
            <div className="w-full md:w-[400px] flex flex-col bg-white rounded-xl shadow p-6 max-h-[600px]">
                <h2 className="text-xl font-bold mb-4 text-gray-900">AI Assistant</h2>
                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2 rounded-lg max-w-[80%] text-base ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-700'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                        disabled
                    >
                        Send
                    </button>
                </form>
                <div className="text-xs text-gray-400 mt-2">AI chat coming soon.</div>
            </div>
        </div>
    );
};

export default DocumentEditor; 