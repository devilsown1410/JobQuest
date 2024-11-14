import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserEdit, faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function JobPilotWork() {
  return (
    <section className="apply-process-area py-12 bg-gray-100 m-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">How JobQuest Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
          <div className="single-process text-center rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="process-ion">
              <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-white mb-4" />
            </div>
            <div className="process-cap">
              <h5>Create an Account</h5>
              <p>Sign up and create your profile to get started.</p>
            </div>
          </div>
          <div className="single-process text-center rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="process-ion">
              <FontAwesomeIcon icon={faUserEdit} size="3x" className="text-white mb-4" />
            </div>
            <div className="process-cap">
              <h5>Complete Profile</h5>
              <p>Fill in your details to complete your profile.</p>
            </div>
          </div>
          <div className="single-process text-center rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="process-ion">
              <FontAwesomeIcon icon={faSearch} size="3x" className="text-white mb-4" />
            </div>
            <div className="process-cap">
              <h5>Find Suitable Job</h5>
              <p>Search and find jobs that match your skills.</p>
            </div>
          </div>
          <div className="single-process text-center rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="process-ion">
              <FontAwesomeIcon icon={faPaperPlane} size="3x" className="text-white mb-4" />
            </div>
            <div className="process-cap">
              <h5>Apply for Job</h5>
              <p>Submit your application and get hired.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobPilotWork;