import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentChatbot from '../components/chat/DocumentChatbot';
import documentChatService from '../services/documentChatService';

const DocumentEditor = () => {
    const { essayId } = useParams();
    const [essay, setEssay] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hi! I am here to help you with your essay.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (message) => {
        try {
            setIsLoading(true);

            // Add user message to chat
            const userMessage = { sender: 'user', text: message };
            setMessages(prev => [...prev, userMessage]);

            // Send message to backend
            const response = await documentChatService.sendMessage(message, essayId);

            // Add AI response to chat
            const aiMessage = { sender: 'ai', text: response.message };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message to chat
            const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
            <DocumentChatbot
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
            />
        </div>
    );
};

export default DocumentEditor; 