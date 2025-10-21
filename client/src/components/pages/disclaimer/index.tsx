import React, { useState } from 'react';

interface DisclaimerPageProps {
  setPage: () => void;
  backPage: () => void;
}

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ setPage, backPage }) => {
  const [hasDownloadedPDF, setHasDownloadedPDF] = useState(false);

  const handleDownloadPDF = () => {
    // Create a link to download the PDF from the client's public folder
    const link = document.createElement('a');
    link.href = '/division_counting/research-informationsheet-exemptresearchstudy.pdf';
    link.download = 'research-informationsheet-exemptresearchstudy.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mark that the user has downloaded the PDF
    setHasDownloadedPDF(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      {/* Back Button */}
      <div className="w-full flex justify-start mb-4">
        <button
          className="text-white text-xl px-3 py-1 rounded hover:bg-blue-700 hover:text-white transition-colors border border-white/20 shadow-sm"
          onClick={() => backPage()}
        >
          ←
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 border-b border-gray-700 pb-2">
        Research Information
      </h1>

      {/* Content */}
      <div className="w-full max-w-4xl text-white space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <p className="text-lg leading-relaxed mb-6">
            Before continuing, please read our research information sheet to understand what you will be expected to do and what information we collect.
          </p>
          
          <div className="text-center">
            <button
              onClick={handleDownloadPDF}
              className={`font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 border ${
                hasDownloadedPDF
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-500 hover:border-green-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:border-blue-400'
              }`}
            >
              {hasDownloadedPDF ? '✅ Downloaded Research Information Sheet (PDF)' : '📄 Download Research Information Sheet (PDF)'}
            </button>
            {hasDownloadedPDF && (
              <p className="text-green-400 text-sm mt-2">
                ✓ Thank you! You can now continue to the study.
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-600">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">What to Expect</h2>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>You will participate in a research study about mathematical problem-solving</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>The study will take approximately 10-20 minutes to complete</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>Your responses will be kept confidential and used only for research purposes</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              <span>You can withdraw from the study at any time without penalty</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-6">
            By clicking "Continue", you acknowledge that you have read and understood the research information sheet.
          </p>
          
          {!hasDownloadedPDF && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 text-sm">
                ⚠️ Please download and read the research information sheet above before continuing.
              </p>
            </div>
          )}
          
          <button
            onClick={setPage}
            disabled={!hasDownloadedPDF}
            className={`font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 border ${
              hasDownloadedPDF
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-500 hover:border-green-400 cursor-pointer'
                : 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
            }`}
          >
            {hasDownloadedPDF ? 'Continue to Study' : 'Please Download PDF First'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
