// src/components/pages/TrainingPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { AssignmentScreen } from './components/AssigmentScreen'
import type { QuestionItem } from '../../ultilities/questionsTemplates'
import { trainingBank } from '../../ultilities/questionsTemplates'

interface TrainingPageProps {
  setPage: () => void
  trainingQuestions: QuestionItem[]
}

const TrainingPage: React.FC<TrainingPageProps> = ({
  setPage,
  trainingQuestions,
}) => {
  const questions = trainingQuestions
  const total = questions.length

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const current = questions[idx]
  const answerKey = current.id.slice(2)
  const correctAnswer = parseInt(
    trainingBank.answers[answerKey as keyof typeof trainingBank.answers],
    10
  )
  const userAns = typed === null ? null : parseInt(typed, 10)
  const isCorrect = userAns === correctAnswer

  const handleKey = useCallback(
    (token: string) => {
      if (!['1', '2', '3', '4'].includes(token)) return
      if (!started) return

      // first press: select answer
      if (typed === null) {
        setTyped(token)
        return
      }

      // second press same key: submit and show feedback
      if (!showFeedback && typed === token) {
        setShowFeedback(true)
        return
      }

      // if they change their mind before confirming, allow new selection
      if (!showFeedback && typed !== token) {
        setTyped(token)
        return
      }

      // after feedback: any press moves to next
      if (showFeedback) {
        if (idx < total - 1) {
          setIdx(i => i + 1)
          setTyped(null)
          setShowFeedback(false)
        } else {
          setPage()
        }
      }
    },
    [started, typed, showFeedback, idx, total, setPage]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
      <h1 className="text-4xl font-extrabold mb-4">Practice</h1>
      <p className="mb-2">
        Question {idx + 1}/{total}
      </p>

      <p>
        <span className="text-lg font-semibold">What is the result of:</span>
      </p>

      <div className="bg-gray-800 p-4 rounded mb-6 max-w-xl w-full text-center">
        {current.id.startsWith('02') ? (
          <BlockMath math={current.text} />
        ) : (
          <code className="text-xl">{current.text}</code>
        )}
      </div>

      {!showFeedback ? (
        typed === null ? (
          <p className="mb-4">
            Press <strong>1</strong>–<strong>4</strong> to select your answer, then press it again to submit.
          </p>
        ) : (
          <p className="mb-4">
            You selected <strong>{typed}</strong>. Press <strong>{typed}</strong> again to submit.
          </p>
        )
      ) : (
        <div className="mb-4">
          {isCorrect ? (
            <p className="text-green-400 font-semibold text-lg">Correct!</p>
          ) : (
            <p className="text-red-400 font-semibold text-lg">
              Incorrect; the right answer was <strong>{correctAnswer}</strong>.
            </p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            Press any key (1–4) to continue.
          </p>
        </div>
      )}
    </div>
  )
}

export default TrainingPage
