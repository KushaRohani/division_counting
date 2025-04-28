// src/components/pages/QuestionScreen.tsx
import React, { useEffect, useCallback } from 'react'
import { KeyboardDisplay } from '../../../ultilities/keyboard'
// KaTeX renderer
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export interface QuestionScreenProps {
  question: string            // raw or LaTeX-formatted string
  useLatex: boolean           // whether to render as LaTeX
  current: number
  total: number
  input: string
  onChange: (val: string) => void
  onNext: () => void
  error: boolean
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  useLatex,
  current,
  total,
  input,
  onChange,
  onNext,
  error,
}) => {
  // Handle virtual keyboard and physical key events
  const handleKey = useCallback(
    (token: string) => {
      if (token === 'DELETE') {
        onChange(input.slice(0, -1))
      } else if (token === 'ENTER') {
        onNext()
      } else if (/^[0-9]$/.test(token)) {
        if (input.length < 2) {
          onChange(input + token)
        }
      }
    },
    [input, onChange, onNext]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKey(e.key)
      } else if (e.key === 'Backspace') {
        handleKey('DELETE')
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleKey('ENTER')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">Experiment</h1>

      <p className="text-white mb-4">Question {current}/{total}</p>

      <div className="bg-gray-800 text-white px-4 py-3 rounded mb-6 border border-gray-700 whitespace-pre-wrap font-mono text-lg">
        {useLatex ? (
          <BlockMath math={question} />
        ) : (
          <code>{question}</code>
        )}
      </div>

      <div className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded min-h-[4rem] font-mono text-white whitespace-pre-wrap break-words">
        {input || <span className="text-gray-500">Type your answer...</span>}
        <span className="inline-block w-1 h-6 bg-white animate-pulse align-bottom ml-1" />
      </div>

      <KeyboardDisplay onKey={handleKey} />

      {error && (
        <p className="text-red-500 mt-2">Please enter a response.</p>
      )}
    </div>
  )
}
