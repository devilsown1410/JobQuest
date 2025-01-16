import React from 'react';
import heroImage from '../../images/h1_hero.jpg';

function HeroSection() {
  return (
    <section
      className="hero-section bg-cover bg-center h-screen flex items-center py-12 bg-gray-100 m-4"
      style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: 'center bottom' }}
    >
      <div className="container mx-auto text-center text-custom-light-blue">
        <h1 className="text-3xl md:text-6xl font-bold leading-tight animate-writeText mb-8">
          Find a job that suits your interest & skills
        </h1>

        <div className="mt-6 flex flex-col md:flex-row justify-center items-center job-search">
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-l md:rounded-none md:rounded-l text-gray-800 mb-4 md:mb-0"
            placeholder="Job title, keywords, or company"
          />
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-none md:rounded-none text-gray-800 mb-4 md:mb-0"
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