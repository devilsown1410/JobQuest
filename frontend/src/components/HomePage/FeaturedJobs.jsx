import React from 'react';

function FeaturedJobs(){
  return(
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Senior UX Designer</h3>
                <p className="text-gray-500">Upwork - Remote</p>
              </div>
              <button className="stylish-button"><span>Apply Now</span></button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Software Engineer</h3>
                <p className="text-gray-500">Google - Full Time</p>
              </div>
              <button className="stylish-button"><span>Apply Now</span></button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Product Manager</h3>
                <p className="text-gray-500">Facebook - Full Time</p>
              </div>
              <button className="stylish-button"><span>Apply Now</span></button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Data Scientist</h3>
                <p className="text-gray-500">Amazon - Full Time</p>
              </div>
              <button className="stylish-button"><span>Apply Now</span></button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Marketing Specialist</h3>
                <p className="text-gray-500">Spotify - Remote</p>
              </div>
              <button className="stylish-button"><span>Apply Now</span></button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Sales Manager</h3>
                <p className="text-gray-500">Salesforce - Full Time</p>
              </div>
              <button className="stylish-button"><span>Apply Now</span></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedJobs;