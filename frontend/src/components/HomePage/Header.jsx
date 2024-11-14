import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-2">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
          JobQuest
        </div>
        <div className="md:flex space-x-6">
          <a href="/" className="text-gray-600 hover:text-blue-600 transition duration-300">Home</a>
          <a href="/find-jobs" className="text-gray-600 hover:text-blue-600 transition duration-300">Find Jobs</a>
          <a href="/companies" className="text-gray-600 hover:text-blue-600 transition duration-300">Companies</a>
          <a href="/support" className="text-gray-600 hover:text-blue-600 transition duration-300">Support</a>
        </div>
        <div className="space-x-4">
        <button
            className="stylish-button"
            onClick={() => navigate('/login')}
          >
            <span className="relative z-10">Sign In</span>
          </button>

          <button
            className="stylish-button bg-pink-300"
            onClick={() => navigate('/postJob')}
          >
            <span className="relative z-10">Post a Job</span>
          </button>

        </div>
        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
            {isMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <a href="/" className="block text-gray-600 hover:text-blue-600 transition duration-300">Home</a>
          <a href="/find-jobs" className="block text-gray-600 hover:text-blue-600 transition duration-300">Find Jobs</a>
          <a href="/" className="block text-gray-600 hover:text-blue-600 transition duration-300">Companies</a>
          <a href="/" className="block text-gray-600 hover:text-blue-600 transition duration-300">Support</a>
        </div>
      )}
    </header>
  );
}

export default Header;