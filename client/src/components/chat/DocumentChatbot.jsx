import React, { useState } from 'react';

const DocumentChatbot = ({ onSendMessage, messages = [], isLoading = false }) => {
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="w-full md:w-[400px] flex flex-col bg-white rounded-xl shadow p-6 max-h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-gray-900">AI Assistant</h2>

            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-lg max-w-[80%] text-base ${msg.sender === 'user'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isLoading
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    disabled={isLoading}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default DocumentChatbot; 