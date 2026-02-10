// src/components/pages/ExperimentPage.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import type { QuestionItem } from '../../ultilities/questionsTemplates'
import { QuestionBank } from '../../ultilities/questionsTemplates'
import type { SurveyData } from '../../../App'

export interface ExperimentPageProps {
  setPage: () => void
  surveyData: SurveyData
  experimentDataRef: React.MutableRefObject<string[]>
  idsRef: React.MutableRefObject<string[]>
  durationsRef: React.MutableRefObject<number[]>
  accuracyRef: React.MutableRefObject<boolean[]>
  questions: QuestionItem[]
  partNumber: number
  totalParts: number
  setSurveyMetrics: (metrics: {
    ids: string[]
    accuracyArray: boolean[]
    durations: number[]
    totalTime: number
    overallAccuracy: number
  }) => void
}

const ExperimentPage: React.FC<ExperimentPageProps> = ({
  setPage,
  experimentDataRef,
  idsRef,
  durationsRef,
  accuracyRef,
  questions,
  partNumber,
  totalParts,
  setSurveyMetrics,
}) => {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [typed, setTyped] = useState<string | null>(null)

  const questionStartRef = useRef<number>(0)
  const total = questions.length
  const question = questions[current]

  // reset on mount
  useEffect(() => {
    idsRef.current = []
    experimentDataRef.current = []
    durationsRef.current = []
    accuracyRef.current = []
  }, [idsRef, experimentDataRef, durationsRef, accuracyRef])

  const handleStart = () => {
    questionStartRef.current = Date.now()
    setStarted(true)
  }

  const handleKey = useCallback(
    (key: string) => {
      if (!started) return
      if (!['1', '2', '3', '4'].includes(key)) return

      // first press: select answer
      if (typed === null) {
        setTyped(key)
        return
      }

      // if they change selection before confirming
      if (typed !== key) {
        setTyped(key)
        return
      }

      // second press same key: confirm
      const now = Date.now()
      idsRef.current.push(question.id)
      experimentDataRef.current.push(key)
      durationsRef.current.push(now - questionStartRef.current)

      // compute correctness
      const answerKey = question.id.slice(2)
      const correctAnswer = parseInt(
        QuestionBank.answers[answerKey as keyof typeof QuestionBank.answers],
        10
      )
      const isCorrect = parseInt(key, 10) === correctAnswer
      accuracyRef.current.push(isCorrect)

      questionStartRef.current = now
      setTyped(null)

      if (current < total - 1) {
        setCurrent(c => c + 1)
      } else {
        // finalize metrics
        const totalTime = durationsRef.current.reduce((a, b) => a + b, 0)
        const arrAcc = [...accuracyRef.current]
        const overall = arrAcc.filter(x => x).length / arrAcc.length

        setSurveyMetrics({
          ids: [...idsRef.current],
          accuracyArray: arrAcc,
          durations: [...durationsRef.current],
          totalTime,
          overallAccuracy: overall,
        })
        setPage()
      }
    },
    [
      started,
      typed,
      current,
      total,
      idsRef,
      experimentDataRef,
      durationsRef,
      accuracyRef,
      question.id,
      setPage,
      setSurveyMetrics,
    ]
  )

  // listen for key presses
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleKey(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-6 py-10">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Ready for the Experiment? 🚀
        </h1>
        <div className="mb-4 px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-300 font-semibold text-lg">
            Part {partNumber} of {totalParts}
          </p>
        </div>
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow-md"
        >
          Start Experiment
        </button>
      </div>
    )
  }

  const progress = ((current + 1) / total) * 100

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      <div className="mb-4 px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg">
        <p className="text-blue-300 font-semibold text-lg">
          Part {partNumber} of {totalParts}
        </p>
      </div>
      <h1 className="text-4xl font-extrabold mb-4 text-white">Experiment</h1>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-4">
        <div className="flex justify-between text-sm mb-2 text-white">
          <span>Question {current + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-lg font-semibold text-white mb-2">
        What is the result of:
      </p>

      <div className="bg-gray-800 text-white p-4 rounded mb-6 max-w-xl w-full text-center">
        {question.id.startsWith('02') ? (
          <BlockMath math={question.text} />
        ) : (
          <code className="text-xl">{question.text}</code>
        )}
      </div>

      {!typed ? (
        <p className="text-gray-400 mb-4">
          Press <strong>1</strong>–<strong>4</strong> to select an answer, then press it again to submit.
        </p>
      ) : (
        <p className="text-gray-400 mb-4">
          You selected <strong>{typed}</strong>. Press <strong>{typed}</strong> again to confirm.
        </p>
      )}
    </div>
  )
}

export default ExperimentPage
