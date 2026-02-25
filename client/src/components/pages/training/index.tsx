// src/components/pages/TrainingPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { AssignmentScreen } from './components/AssigmentScreen'
import type { QuestionItem } from '../../ultilities/questionsTemplates'

interface TrainingPageProps {
  setPage: () => void
  trainingQuestions: QuestionItem[]
  partNumber: number
  totalParts: number
}

const TrainingPage: React.FC<TrainingPageProps> = ({
  setPage,
  trainingQuestions,
  partNumber,
  totalParts,
}) => {
  // Remove first 5 questions
  const questions = trainingQuestions.slice(5)
  const total = questions.length

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState<string | null>(null)
  const [skipPending, setSkipPending] = useState(false)

  const current = questions[idx]
  const progress = ((idx + 1) / total) * 100

  const handleKey = useCallback(
    (token: string) => {
      if (!started) return

      // --- Skip: Space to select, Space again to confirm ---
      if (token === ' ') {
        if (skipPending) {
          setSkipPending(false)
          if (idx < total - 1) {
            setIdx(i => i + 1)
            setTyped(null)
          } else {
            setPage()
          }
        } else if (typed === null) {
          setSkipPending(true)
        } else {
          setTyped(null)
          setSkipPending(true)
        }
        return
      }

      // --- Answer: 1–4 to select, same key again to confirm ---
      if (!['1', '2', '3', '4'].includes(token)) return

      if (skipPending) {
        setSkipPending(false)
        setTyped(token)
        return
      }

      if (typed === null) {
        setTyped(token)
        return
      }

      if (typed !== token) {
        setTyped(token)
        return
      }

      if (idx < total - 1) {
        setIdx(i => i + 1)
        setTyped(null)
      } else {
        setPage()
      }
    },
    [started, typed, skipPending, idx, total, setPage]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') e.preventDefault()
      handleKey(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  if (questions.length === 0) {
    return <div className="text-center p-8 text-white">Loading…</div>
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-6 py-10">
        <AssignmentScreen onStart={() => setStarted(true)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10 text-white">
      <div className="mb-4 px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg">
        <p className="text-blue-300 font-semibold text-lg">
          Part {partNumber} of {totalParts}
        </p>
      </div>
      <h1 className="text-4xl font-extrabold mb-4">Practice</h1>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {idx + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="mb-2">
        <span className="text-lg font-semibold">What is the result of:</span>
      </p>

      <div className="bg-gray-800 p-4 rounded mb-6 max-w-xl w-full text-center">
        {current.id.startsWith('02') ? (
          <BlockMath math={current.text} />
        ) : (
          <code className="text-xl">{current.text}</code>
        )}
      </div>

      {skipPending ? (
        <p className="mb-4 text-amber-400">
          Skip selected. Press <strong>Space</strong> again to confirm.
        </p>
      ) : typed === null ? (
        <p className="mb-4 text-gray-400">
          Press <strong>1</strong>–<strong>4</strong> to select an answer, then press it again to submit.
        </p>
      ) : (
        <p className="mb-4 text-gray-400">
          You selected <strong>{typed}</strong>. Press <strong>{typed}</strong> again to confirm.
        </p>
      )}

      <p className="text-gray-500 text-sm mt-2 border-t border-gray-700 pt-3 max-w-xl">
        To skip this question: press <strong>Space</strong> to choose skip, then <strong>Space</strong> again to confirm.
      </p>
    </div>
  )
}

export default TrainingPage
