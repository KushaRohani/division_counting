// src/components/pages/experiment/components/questionScreen.tsx
import React, { useEffect, useCallback } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { KeyboardDisplay } from '../../../ultilities/keyboard'
import type { QuestionItem } from '../../../ultilities/questionsTemplates'

export interface QuestionProps {
  question: QuestionItem
  current: number
  total: number
  input: string
  onChange: (val: string) => void
  onNext: () => void
  attemptedSubmit: boolean
  submitted: boolean
}

const QuestionScreen: React.FC<QuestionProps> = ({
  question,
  current,
  total,
  input,
  onChange,
  onNext,
  attemptedSubmit,
  submitted,
}) => {
  // Clear the input whenever the question changes
  useEffect(() => {
    onChange('')
  }, [question.id, onChange])

  const handleKey = useCallback(
    (tok: string) => {
      if (submitted) return
      if (tok === 'DELETE') {
        onChange('')
      } else if (['1', '2', '3', '4'].includes(tok)) {
        if (!input) {
          onChange(tok)
        } else if (input === tok) {
          onNext()
        } else {
          onChange(tok)
        }
      }
    },
    [submitted, input, onChange, onNext]
  )

  // Listen for keyboard events
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) handleKey(e.key)
      else if (e.key === 'Backspace') handleKey('DELETE')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-4">Experiment</h1>

      <p className="mb-1 text-center">
        Question {current + 1}/{total} — ID <code>{question.id}</code>
      </p>

      <div className="bg-gray-800 p-4 rounded mb-6 max-w-xl w-full text-center">
        {question.id.startsWith('02') ? (
          <BlockMath math={question.text} />
        ) : (
          <code className="text-xl">{question.text}</code>
        )}
      </div>

      <div className="mb-4 p-2 border border-gray-600 rounded min-h-[4rem] font-mono whitespace-pre-wrap bg-gray-800 text-white max-w-xl w-full">
        {input || <span className="text-gray-500">Press 1–4 to answer</span>}
        <span className="inline-block w-1 h-6 bg-white animate-pulse align-bottom ml-1" />
      </div>

      <KeyboardDisplay onKey={handleKey} />

      {attemptedSubmit && input === '' && !submitted && (
        <p className="text-red-500 mt-2 text-center">
          Please enter a response.
        </p>
      )}
    </div>
  )
}

export default QuestionScreen
