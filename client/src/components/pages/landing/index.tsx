import React from 'react';

interface LandingPageProps {
  setPage: (page: 'landing' | 'info') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gray-900">

      <p className="text-white text-md max-w-lg text-center mb-10 leading-relaxed">
        Welcome and thank you for your interest in participating in our study.
        In this experiment, you will be calculating mathematical expressions in various formats.
        The experiment should take no longer than 10 minutes of your time.
      </p>

      <button
        onClick={() => setPage('info')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md transition-all"
      >
        Next
      </button>
    </div>
  );
};

export default LandingPage;
