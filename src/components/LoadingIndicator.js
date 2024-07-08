import React from 'react';

const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-5 text-center text-gray-700">👇 Protecting your image...</p>
        </div>
    </div>
);

export default LoadingIndicator;