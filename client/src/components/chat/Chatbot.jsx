// src/components/chat/Chatbot.jsx
import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "I'm here to help you with your university application. Could you tell me about your current field of study?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white rounded-lg shadow-lg">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">University Application Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-75">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;