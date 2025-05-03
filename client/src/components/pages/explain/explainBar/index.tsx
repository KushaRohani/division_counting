// src/components/pages/explain/ExplainBar.tsx
import React from 'react'
import { BlockMath } from 'react-katex'
interface ExplainBarProps {
  onNext: () => void
}

const ExplainBar: React.FC<ExplainBarProps> = ({ onNext }) => {
  const latex = "\\frac{4}{2} = 2"
  const latex2 = "(\\frac{a}{b})"
  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      <h1 className="text-4xl font-extrabold text-white mb-4">
        Bar division Explanation
      </h1>

      <p className="text-white text-md text-center max-w-xl mb-6">
        In this experiment, you will treat <BlockMath>{latex2}</BlockMath> as 'a' being divided by 'b'.
        As a reminder of some mathematical notation:
      </p>

      <div className="bg-gray-800 text-white px-4 py-3 rounded max-w-xl w-full mb-8 border border-gray-700 whitespace-pre-wrap">
        <code>
          + is the addition operator, ex. <BlockMath>1 + 2 = 3</BlockMath>
          <br />
          - is the subtraction operator, ex. <BlockMath>3 - 2 = 1</BlockMath>
          <br />
          / is the division operator, ex. <BlockMath>{latex}</BlockMath>
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

export default ExplainBar
