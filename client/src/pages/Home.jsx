// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
          Upcoming Deadlines
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">(Placeholder)</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
          Messages
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">(Placeholder)</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
          Applications
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">(Placeholder)</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
          Saved
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">(Placeholder)</div>
      </div>
    </main>
  );
};

export default Home;