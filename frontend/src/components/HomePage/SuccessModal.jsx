import React from 'react';
import PropTypes from 'prop-types';

const SuccessModal =({ message = 'Operation completed successfully!', onClose })=>{
  return(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-transform duration-300 ease-in-out scale-100">
        <h2 className="text-xl font-semibold text-center text-green-600">Success</h2>
        <p className="mt-4 text-center text-gray-700">{message}</p>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={onClose} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default SuccessModal;
