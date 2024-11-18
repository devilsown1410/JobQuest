import React from 'react';
import heroImage from '../../images/h1_hero.jpg';

function HeroSection(){
  return(
    <section
      className="bg-cover bg-center h-screen flex items-center"
      style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: 'center bottom' }}
    >
      <div className="container mx-auto text-left text-custom-light-blue">
        <h1 className="text-6xl md:text-6xl font-bold leading-tight animate-writeText w-1/2">
          Find a job that suits your interest & skills
        </h1>

        <div className="mt-6 flex justify-left">
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-l text-gray-800"
            placeholder="Job title, keywords, or company"
          />
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-none text-gray-800"
            placeholder="Location"
          />
          <button className="stylish-button">
          <span className="relative z-10">Find Job</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;