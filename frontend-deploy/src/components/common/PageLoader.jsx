import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-300 text-lg font-medium">{message}</p>
        <div className="text-center text-sm text-gray-500">
          <p>Getting things ready for you</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;