import React from 'react';

const Overlay = ({ isVisible, preview, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
          onClick={onClose}  // Trigger onClose to close the overlay
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="File Preview"
            className="w-full h-auto object-contain rounded"
          />
        )}
      </div>
    </div>
  );
};

export default Overlay;
