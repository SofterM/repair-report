// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-purple-200"> {/* Updated background */}
      <img
        src="https://upload.wikimedia.org/wikipedia/th/0/00/University_of_Phayao_Logo.svg"
        alt="University of Phayao Logo"
        className="w-48 h-auto mb-4" // Increased size of the logo
      />
      <div className="loader mb-4"></div> {/* Added margin to separate the loader from the logo */}
      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.3);
          border-left-color: #4c51bf; /* Change this color to match your theme */
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;