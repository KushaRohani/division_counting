import React from 'react';

interface UnderAgeProps {
  goHome: () => void;
}

const UnderAge: React.FC<UnderAgeProps> = ({ goHome }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 border-b border-gray-700 pb-2">
        Underage Notice
      </h1>

      {/* Content */}
      <div className="w-full max-w-3xl text-white space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <p className="text-lg leading-relaxed mb-6 text-center">
            We appreciate your interest in participating in our research study. 💡
          </p>
          <p className="text-lg leading-relaxed mb-6 text-center text-red-400 font-semibold">
            Unfortunately, individuals under 18 years old are not eligible to participate in this study.
          </p>
          <p className="text-gray-300 text-center">
            This restriction is in place to comply with research ethics and institutional review board (IRB) guidelines.
          </p>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={goHome}
            className="font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 border bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:border-blue-400"
          >
            ← Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderAge;
