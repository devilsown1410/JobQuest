import React from 'react';

const ConfirmationModal = ({ onConfirm, onCancel, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-5 w-1/3">
                <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
                <p className="mb-4">{children}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg mr-2"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;