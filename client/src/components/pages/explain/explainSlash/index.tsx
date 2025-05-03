// src/components/pages/explain/ExplainSlash.tsx
import React from 'react'

interface ExplainSlashProps {
  onNext: () => void
}

const ExplainSlash: React.FC<ExplainSlashProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      <h1 className="text-4xl font-extrabold text-white mb-4">
        Slash division Explanation
      </h1>

      <p className="text-white text-md text-center max-w-xl mb-6">
        In this experiment, you will treat "a / b" as 'a' being divided by 'b'.
        As a reminder of some mathematical notation:
      </p>

      <div className="bg-gray-800 text-white px-4 py-3 rounded max-w-xl w-full mb-8 border border-gray-700 whitespace-pre-wrap">
        <code>
        + is the addition operator, ex. 1 + 2 = 3
        - is the subtraction operator, ex. 3 - 2 = 1
        / is the division operator, ex. 4 / 2 = 2
        </code>
      </div>

      <button
        onClick={onNext}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow-md"
      >
        Got it, let’s train!
      </button>
    </div>
  )
}

export default ExplainSlash
