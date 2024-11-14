import React from 'react';

const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default Spinner;