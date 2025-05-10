// src/pages/Home.jsx
import React from 'react';
import Chatbot from '../components/chat/Chatbot';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Your Journey to Higher Education Starts Here
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Get personalized university recommendations and application guidance
                  with our AI-powered assistant.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg">
                  Start Your Application
                </button>
              </div>
              
              <div className="flex justify-center">
                <Chatbot />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;