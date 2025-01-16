import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobQuest2 from '../../images/JobQuest2.png';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleNavigate = () => {
    navigate('/find-jobs');
  };

  return (
    <header className="bg-white shadow-md p-2">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
          <img src={JobQuest2} alt="Logo" className="h-auto max-h-[70px] w-auto max-w-full rounded-full object-contain shadow-md transition duration-300 hover:shadow-xl cursor-pointer" />
        </div>
        <div className="hidden md:flex space-x-6">
          <a onClick={() => navigate('/')} className="text-gray-600 hover:text-blue-600 transition duration-300">Home</a>
          <a onClick={handleNavigate} className="text-gray-600 hover:text-blue-600 transition duration-300">Find Jobs</a>
          <a onClick={() => navigate('/companies')} className="text-gray-600 hover:text-blue-600 transition duration-300">Companies</a>
          <a onClick={() => navigate("/support")} className="text-gray-600 hover:text-blue-600 transition duration-300">Support</a>
        </div>
        <div className="hidden md:flex space-x-4">
          <button className="stylish-button" onClick={() => navigate('/login')}>
            <span className="relative z-10">Sign In</span>
          </button>
          <button className="stylish-button bg-pink-300" onClick={() => navigate('/postJob')}>
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
          <a onClick={() => navigate('/')} className="block text-gray-600 hover:text-blue-600 transition duration-300">Home</a>
          <a onClick={handleNavigate} className="block text-gray-600 hover:text-blue-600 transition duration-300">Find Jobs</a>
          <a onClick={() => navigate('/companies')} className="block text-gray-600 hover:text-blue-600 transition duration-300">Companies</a>
          <a onClick={() => navigate("/support")} className="block text-gray-600 hover:text-blue-600 transition duration-300">Support</a>
          <button className="block w-full stylish-button mt-4" onClick={() => navigate('/login')}>
            <span className="relative z-10">Sign In</span>
          </button>
          <button className="block w-full stylish-button bg-pink-300 mt-4" onClick={() => navigate('/postJob')}>
            <span className="relative z-10">Post a Job</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;