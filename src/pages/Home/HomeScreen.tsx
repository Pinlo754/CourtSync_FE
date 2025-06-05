import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl text-[red]">Court Sync homepage</h1>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick = { () => navigate('/about') }> Go to About Page
        </button>
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick = { () => navigate('/not-found') }> Go to Not Found Page
        </button>
    </div>
  );
};

export default Home;
