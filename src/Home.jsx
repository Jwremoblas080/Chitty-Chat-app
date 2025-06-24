import React from 'react';
import { Link } from 'react-router-dom'; // Only if using react-router

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to React + Tailwind</h1>
        <p className="mb-6 text-lg">This is the homepage of your modern app built with Tailwind CSS.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
