import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faTooth, faLaptopCode, faDatabase, faMoneyCheckAlt, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

function PopularVacancies(){
  return(
    <section className="py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-center mb-8">Most Popular Vacancies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vacancy Card */}
          <div className="single-job-items bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div className="company-img mb-4">
              <FontAwesomeIcon icon={faUserMd} size="3x" />
            </div>
            <div className="job-tittle text-center">
              <a href="#">
                <h4 className="text-xl font-semibold">AIML Developer</h4>
              </a>
              <ul className="mt-2">
                <li className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>50,364 Open Positions</li>
              </ul>
            </div>
          </div>

          <div className="single-job-items bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div className="company-img mb-4">
              <FontAwesomeIcon icon={faLaptopCode} size="3x" />
            </div>
            <div className="job-tittle text-center">
              <a href="#">
                <h4 className="text-xl font-semibold">Software Developer</h4>
              </a>
              <ul className="mt-2">
                <li className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>45,904 Open Positions</li>
              </ul>
            </div>
          </div>


          <div className="single-job-items bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div className="company-img mb-4">
              <FontAwesomeIcon icon={faDatabase} size="3x" />
            </div>
            <div className="job-tittle text-center">
              <a href="#">
                <h4 className="text-xl font-semibold">Data Scientists</h4>
              </a>
              <ul className="mt-2">
                <li className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>28,200 Open Positions</li>
              </ul>
            </div>
          </div>

          <div className="single-job-items bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div className="company-img mb-4">
              <FontAwesomeIcon icon={faMoneyCheckAlt} size="3x" />
            </div>
            <div className="job-tittle text-center">
              <a href="#">
                <h4 className="text-xl font-semibold">Financial Manager</h4>
              </a>
              <ul className="mt-2">
                <li className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>61,391 Open Positions</li>
              </ul>
            </div>
          </div>

          <div className="single-job-items bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div className="company-img mb-4">
              <FontAwesomeIcon icon={faNetworkWired} size="3x" />
            </div>
            <div className="job-tittle text-center">
              <a href="#">
                <h4 className="text-xl font-semibold">IT Manager</h4>
              </a>
              <ul className="mt-2">
                <li className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>50,963 Open Positions</li>
              </ul>
            </div>
          </div>

          <div className="single-job-items bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div className="company-img mb-4">
              <FontAwesomeIcon icon={faSearch} size="3x" />
            </div>
            <div className="job-tittle text-center">
              <a href="#">
                <h4 className="text-xl font-semibold">Operation Research Analyst</h4>
              </a>
              <ul className="mt-2">
                <li className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>16,627 Open Positions</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default PopularVacancies;