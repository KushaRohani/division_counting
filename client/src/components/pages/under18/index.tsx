import React from 'react';

interface Under18PageProps {
  setPage: () => void;
}

const Under18Page: React.FC<Under18PageProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 border-b border-gray-700 pb-2">
        Age Restriction
      </h1>

      {/* Content */}
      <div className="w-full max-w-2xl text-white text-center space-y-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Participation Not Available
          </h2>
          <p className="text-lg leading-relaxed">
            We apologize, but participants under 18 years of age are not eligible to participate in this study.
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-6">
          <p className="text-gray-300 leading-relaxed">
            This research study has age restrictions in place to ensure compliance with research ethics guidelines and institutional requirements. 
            We appreciate your interest in participating and encourage you to consider other research opportunities that may be available to your age group.
          </p>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 mb-6">
            Thank you for your understanding.
          </p>
          
          {/* Home Button */}
          <button
            onClick={setPage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded shadow-md transition-all text-lg"
          >
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Under18Page;
