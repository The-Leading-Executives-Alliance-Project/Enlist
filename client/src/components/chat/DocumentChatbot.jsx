import React, { useState } from 'react';

const DocumentChatbot = ({
    onSendMessage,
    messages = [],
    isLoading = false,
    suggestionSections = [],
    onAcceptChange,
    onRejectChange
}) => {
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        onSendMessage(input);
        setInput('');
    };

    const handleAcceptChange = (sectionId, changeIndex) => {
        if (onAcceptChange) {
            onAcceptChange(sectionId, changeIndex);
        }
    };

    const handleRejectChange = (sectionId, changeIndex) => {
        if (onRejectChange) {
            onRejectChange(sectionId, changeIndex);
        }
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

                            {/* Show suggestion sections for AI messages */}
                            {msg.sender === 'ai' && msg.suggestionSections && msg.suggestionSections.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {msg.suggestionSections.map((section) => (
                                        <div key={section.id} className="bg-white rounded border border-gray-300 p-3">
                                            <div className="mb-3">
                                                <h4 className="font-semibold text-sm text-gray-800 mb-1">
                                                    {section.title}
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    {section.description}
                                                </p>
                                            </div>

                                            {/* Show individual changes with individual action buttons */}
                                            <div className="space-y-3">
                                                {section.changes.map((change, changeIndex) => (
                                                    <div key={changeIndex} className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-sm text-gray-800 mb-1">
                                                                    {changeIndex + 1}. {change.title || `Improvement ${changeIndex + 1}`}
                                                                </h5>
                                                                <p className="text-xs text-gray-600 mb-2">
                                                                    {change.description}
                                                                </p>
                                                            </div>
                                                            {change.status === 'pending' && (
                                                                <div className="flex gap-1 ml-2">
                                                                    <button
                                                                        onClick={() => handleAcceptChange(section.id, changeIndex)}
                                                                        className="w-6 h-6 border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-green-600 rounded flex items-center justify-center transition-colors text-xs"
                                                                        title="Accept this improvement"
                                                                    >
                                                                        ✓
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectChange(section.id, changeIndex)}
                                                                        className="w-6 h-6 border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-red-600 rounded flex items-center justify-center transition-colors text-xs"
                                                                        title="Reject this improvement"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {change.status === 'accepted' && (
                                                                <span className="text-xs text-green-600 font-medium ml-2">
                                                                    ✓ Accepted
                                                                </span>
                                                            )}
                                                            {change.status === 'rejected' && (
                                                                <span className="text-xs text-red-600 font-medium ml-2">
                                                                    ✕ Rejected
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Text comparison */}
                                                        <div className="text-xs bg-gray-50 p-2 rounded">
                                                            <div className="text-gray-600">
                                                                <span className="line-through text-red-500">
                                                                    "{change.originalText || '...'}"
                                                                </span>
                                                                <span className="mx-1">→</span>
                                                                <span className="text-green-600">
                                                                    "{change.newText}"
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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