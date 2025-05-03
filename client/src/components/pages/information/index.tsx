// src/components/pages/information.tsx
import React from 'react'
interface InfoPageProps {
  setPage: () => void
  backPage: () => void
}

const InfoPage: React.FC<InfoPageProps> = ({ setPage, backPage }) => {
  
  return (
    <div className="flex flex-col h-full w-full items-center justify-between p-6">
      {/* Back button */}
      <div className="w-full flex justify-start mb-4">
        <button
          className="text-white text-xl px-3 py-1 rounded hover:bg-blue-700 transition-colors border border-white/20 shadow-sm"
          onClick={backPage}
        >
          ←
        </button>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-white tracking-tight text-center mt-8 mb-4 border-b border-gray-700 pb-2">
        How the Experiment Works
      </h1>

      {/* Instructions */}
      <div className="max-w-2xl text-white text-md text-center leading-relaxed mb-8">
        <p className="mb-4">
          You'll see a series of arithmetic expressions in one of two formats.
        </p>
    
        <p className="mb-4">
          Your task is to evaluate each expression and then press one of the numeric keys
          <strong> 1</strong> through <strong>4</strong> on your keyboard once to select and again to confirm your answer.
        </p>
        <p className="mb-4">
          Try your best on each question. If you don't know the answer, make your best guess and move on.
        </p>
      </div>

      {/* Continue button */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-10 mb-6 shadow-lg transition-all"
        onClick={setPage}
      >
        Start Experiment
      </button>
    </div>
  )
}

export default InfoPage
