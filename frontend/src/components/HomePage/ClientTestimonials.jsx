import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function ClientTestimonials(){
  return(
    <section className="testimonial-area py-12 bg-gray-100 m-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="testimonial-caption p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="testimonial-top-cap">
              <FontAwesomeIcon icon={faUserCircle} size="6x" className="text-gray-500 mb-4 mx-auto" />
              <p className="text-gray-500 italic">"Helped me find my dream job!"</p>
              <div className="flex justify-center mt-4">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="mt-4 font-bold text-blue-600">Bessie Cooper</p>
              <p className="text-gray-500">Creative Director</p>
            </div>
          </div>

          <div className="testimonial-caption p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="testimonial-top-cap">
              <FontAwesomeIcon icon={faUserCircle} size="6x" className="text-gray-500 mb-4 mx-auto" />
              <p className="text-gray-500 italic">"A fantastic service with great support!"</p>
              <div className="flex justify-center mt-4">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="mt-4 font-bold text-blue-600">John Doe</p>
              <p className="text-gray-500">Software Engineer</p>
            </div>
          </div>

          <div className="testimonial-caption p-6 bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <div className="testimonial-top-cap">
              <FontAwesomeIcon icon={faUserCircle} size="6x" className="text-gray-500 mb-4 mx-auto" />
              <p className="text-gray-500 italic">"Highly recommend to anyone looking for a job!"</p>
              <div className="flex justify-center mt-4">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="mt-4 font-bold text-blue-600">Jane Smith</p>
              <p className="text-gray-500">Marketing Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientTestimonials;