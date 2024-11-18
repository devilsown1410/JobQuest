import React from 'react';

function PopularCategory(){
  return(
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 text-center rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md">
            <h3 className="font-bold text-xl text-blue-600">Health & Care</h3>
            <p className="text-gray-500">3125 open positions</p>
          </div>
          <div className="p-6 bg-blue-50 text-center rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md">
            <h3 className="font-bold text-xl text-blue-600">Data & Science</h3>
            <p className="text-gray-500">57 open positions</p>
          </div>
          <div className="p-6 bg-blue-50 text-center rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md">
            <h3 className="font-bold text-xl text-blue-600">Finance</h3>
            <p className="text-gray-500">123 open positions</p>
          </div>
          <div className="p-6 bg-blue-50 text-center rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md">
            <h3 className="font-bold text-xl text-blue-600">Technology</h3>
            <p className="text-gray-500">456 open positions</p>
          </div>
          <div className="p-6 bg-blue-50 text-center rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md">
            <h3 className="font-bold text-xl text-blue-600">Education</h3>
            <p className="text-gray-500">789 open positions</p>
          </div>
          <div className="p-6 bg-blue-50 text-center rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md">
            <h3 className="font-bold text-xl text-blue-600">Marketing</h3>
            <p className="text-gray-500">101 open positions</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularCategory;