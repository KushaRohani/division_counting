// src/components/pages/TrainingPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { PageKey, PAGES } from '../../../App'
import { getQuestions, countXDivisions, toLatexSimple } from '../../ultilities/questionsTemplates'
import { KeyboardDisplay } from '../../ultilities/keyboard'
import { AssignmentScreen } from './components/AssigmentScreen'

// import KaTeX renderer
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

const TrainingPage: React.FC<{ setPage: (page: PageKey) => void }> = ({ setPage }) => {
  const [questions, setQuestions] = useState<string[]>([])
  useEffect(() => {
    setQuestions(() => {
      const qs: string[] = []
      for (let i = 4; i < 14; i++) qs.push(getQuestions(i))
      return qs
    })
  }, [])

  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // new: decide per-question whether to render as LaTeX
  const [useLatex, setUseLatex] = useState(false)
  useEffect(() => {
    setUseLatex(Math.random() < 0.5)
  }, [idx])

  const handleKey = useCallback(
    (token: string) => {
      if (token === 'DELETE') setTyped((t) => t.slice(0, -1))
      else if (token === 'ENTER') {
        if (!showFeedback) {
          if (typed === '') {
            setAttempted(true)
            return
          }
          setShowFeedback(true)
        } else {
          if (idx < questions.length - 1) {
            setIdx((i) => i + 1)
            setTyped('')
            setAttempted(false)
            setShowFeedback(false)
          } else {
            setPage(PAGES.experiment)
          }
        }
      } else if (/[0-9]/.test(token)) {
        if (!showFeedback && typed.length < 2) setTyped((t) => t + token)
      }
    },
    [idx, questions.length, typed, showFeedback, setPage]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKey('ENTER')
        return
      }
      if (showFeedback) return
      if (/[0-9]/.test(e.key)) handleKey(e.key)
      else if (e.key === 'Backspace') handleKey('DELETE')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey, showFeedback])

  if (!questions.length) return <div className="text-center p-8 text-white">Loading…</div>

  // raw vs LaTeX
  const raw = questions[idx]
  const latex = toLatexSimple(raw)
  const display = useLatex ? latex : raw

  // correct answer stays based on raw
  const correctAnswer = countXDivisions(raw)
  const userAnswer = parseInt(typed, 10)
  const isCorrect = userAnswer === correctAnswer

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-6 py-10">
        <AssignmentScreen onStart={() => setStarted(true)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10 text-white">
      <h1 className="text-4xl font-extrabold mb-4">Training</h1>

      {!showFeedback ? (
        <>
          <p className="mb-1">Question {idx + 1}/{questions.length}</p>

          <div className="bg-gray-800 p-4 rounded mb-4 max-w-xl w-full whitespace-pre-wrap">
            {useLatex ? (
              <BlockMath math={display} />
            ) : (
              <code>{display}</code>
            )}
          </div>

          <div className="mb-4 w-full max-w-xl">
            <div className="p-2 bg-gray-900 border border-gray-700 rounded min-h-[3rem] font-mono">
              {typed || <span className="text-gray-500">Type your answer…</span>}
            </div>
            {attempted && <p className="text-red-500 mt-2">Please enter a response.</p>}
          </div>

          <KeyboardDisplay onKey={handleKey} />
        </>
      ) : (
        <div className="bg-gray-800 p-6 rounded max-w-xl w-full space-y-4">
          <h2 className="text-xl mb-2">Feedback</h2>

          <div>
            <p className="text-sm text-gray-400 mb-1">Original expression:</p>
            <div className="bg-gray-700 p-2 rounded whitespace-pre-wrap">
              {useLatex ? (
                <BlockMath math={display} />
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono">{display}</pre>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Your answer:</p>
              <span className={`px-3 py-1 font-bold text-lg rounded ${
                isCorrect ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {isNaN(userAnswer) ? 'Invalid' : userAnswer}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Correct answer:</p>
              <span className="px-3 py-1 inline-block rounded bg-blue-600 font-bold text-lg">
                {correctAnswer}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleKey('ENTER')}
            className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

export default TrainingPage