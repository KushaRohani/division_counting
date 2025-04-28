// src/components/pages/ExperimentPage.tsx
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { PageKey, PAGES, SurveyData } from '../../../App'
import { QuestionScreen } from './components/questionScreen'
import { countXDivisions, toLatexSimple, GroupEnum } from '../../ultilities/questionsTemplates'

const apiUrl = import.meta.env.VITE_API_URL

export interface ExperimentPageProps {
  setPage: (page: PageKey) => void
  surveyData: SurveyData
  experimentDataRef: React.MutableRefObject<string[]>
  durationsRef: React.MutableRefObject<number[]>
  accuracyRef: React.MutableRefObject<boolean[]>
  questions: string[]
  assignmentId: number
  group: GroupEnum
  setSurveyMetrics: (metrics: {
    accuracyArray: boolean[]
    durations: number[]
    totalTime: number
    overallAccuracy: number
  }) => void
  clearSurveyData: () => void
}

const ExperimentPage: React.FC<ExperimentPageProps> = ({
  setPage,
  surveyData,
  experimentDataRef,
  durationsRef,
  accuracyRef,
  questions,
  assignmentId,
  group,
  setSurveyMetrics,
  clearSurveyData,
}) => {
  const [started, setStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const startTime = useRef<number>(0)
  const questionTime = useRef<number>(0)

  const handleStart = () => {
    const now = Date.now()
    startTime.current = now
    questionTime.current = now
    setStarted(true)
  }

  const handleNext = async () => {
    if (!input.trim()) {
      setError(true)
      return
    }
    setError(false)

    const now = Date.now()
    durationsRef.current[currentIdx] = now - questionTime.current
    questionTime.current = now

    const raw = questions[currentIdx]
    const correctCount = countXDivisions(raw)
    const answer = parseInt(input, 10)
    accuracyRef.current[currentIdx] = answer === correctCount
    experimentDataRef.current[currentIdx] = input

    setInput('')

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      return
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime.current
    const correctAnswers = accuracyRef.current.filter(Boolean).length
    const overallAcc = correctAnswers / questions.length

    setSurveyMetrics({
      accuracyArray: accuracyRef.current,
      durations: durationsRef.current,
      totalTime,
      overallAccuracy: overallAcc,
    })

    try {
      await axios.post(`${apiUrl}/kusha`, {
        assignmentId,
        group,                            // send group to the server
        yearsProgramming: surveyData.yearsProgramming,
        age: surveyData.age,
        sex: surveyData.sex,
        language: surveyData.language,
        email: surveyData.email,
        task_accuracy: accuracyRef.current,
        durations: durationsRef.current,
        totalTime,
        overallAccuracy: overallAcc,
      })
    } catch (err) {
      console.error('Submit error', err)
    }

    clearSurveyData()
    setPage(PAGES.thankyou)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (started) handleNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, currentIdx, input])

  const raw = questions[currentIdx]
  const displayQuestion =
    group === GroupEnum.latex ? toLatexSimple(raw) : raw
  const useLatex = group === GroupEnum.latex

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      {!started ? (
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Ready for the Experiment? 🚀
          </h1>
          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
          >
            Start Experiment
          </button>
        </div>
      ) : (
        <QuestionScreen
          question={displayQuestion}
          useLatex={useLatex}
          current={currentIdx + 1}
          total={questions.length}
          input={input}
          onChange={setInput}
          onNext={handleNext}
          error={error}
        />
      )}
    </div>
  )
}

export default ExperimentPage
