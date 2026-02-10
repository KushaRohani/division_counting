// src/components/pages/treatment.tsx
import React, { useState, useEffect } from 'react'
import TrainingPage from '../training'
import ExperimentPage from '../experiment'
import { fetchTrainingItems } from '../../ultilities/questionsTemplates'
import type { QuestionItem } from '../../ultilities/questionsTemplates'
import type { SurveyData } from '../../../App'

export interface TreatmentStep {
  ExplainComponent: React.FC<{ onNext: () => void; partNumber: number; totalParts: number }>
  questions: QuestionItem[]
}

export interface TreatmentProps {
  steps: TreatmentStep[]
  surveyDataRef: React.MutableRefObject<SurveyData>
  experimentDataRef: React.MutableRefObject<string[]>
  idsRef: React.MutableRefObject<string[]>
  durationsRef: React.MutableRefObject<number[]>
  accuracyRef: React.MutableRefObject<boolean[]>
  onFinish: () => void
}

const Treatment: React.FC<TreatmentProps> = ({
  steps,
  surveyDataRef,
  experimentDataRef,
  idsRef,
  durationsRef,
  accuracyRef,
  onFinish,
}) => {
  // Randomize order of the two groups once on mount
  const [orderedSteps, setOrderedSteps] = useState<TreatmentStep[]>([])
  useEffect(() => {
    if (steps.length === 2) {
      const copy = [...steps]
      if (Math.random() < 0.5) copy.reverse()
      setOrderedSteps(copy)
    } else {
      setOrderedSteps(steps)
    }
  }, [steps])

  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<'explain' | 'train' | 'experiment'>(
    'explain'
  )
  const [trainingPool, setTrainingPool] = useState<QuestionItem[]>([])

  // load both raw & LaTeX training items once
  useEffect(() => {
    fetchTrainingItems().then(items => setTrainingPool(items))
  }, [])

  const handleNext = () => {
    if (phase === 'explain') {
      setPhase('train')
    } else if (phase === 'train') {
      // reset metrics before experiment
      idsRef.current = []
      durationsRef.current = []
      accuracyRef.current = []
      experimentDataRef.current = []
      setPhase('experiment')
    } else {
      if (stepIndex < orderedSteps.length - 1) {
        setStepIndex(i => i + 1)
        setPhase('explain')
      } else {
        onFinish()
      }
    }
  }

  // If we haven't yet set orderedSteps, show loading
  if (orderedSteps.length === 0) {
    return <div className="text-center p-8 text-white">Loading…</div>
  }

  const current = orderedSteps[stepIndex]
  const currentPart = stepIndex + 1
  const totalParts = orderedSteps.length

  if (phase === 'explain') {
    return <current.ExplainComponent onNext={handleNext} partNumber={currentPart} totalParts={totalParts} />
  }

  // pick only the training items matching this group's prefix
  const prefix = current.questions[0]?.id.slice(0, 2) ?? ''
  const trainingQuestions = trainingPool.filter(q =>
    q.id.startsWith(prefix)
  )

  if (phase === 'train') {
    return (
      <TrainingPage
        setPage={handleNext}
        trainingQuestions={trainingQuestions}
        partNumber={currentPart}
        totalParts={totalParts}
      />
    )
  }

  // experiment phase: render questions & gather metrics
  return (
    <ExperimentPage
      setPage={handleNext}
      surveyData={surveyDataRef.current}
      experimentDataRef={experimentDataRef}
      idsRef={idsRef}
      durationsRef={durationsRef}
      accuracyRef={accuracyRef}
      questions={current.questions}
      partNumber={currentPart}
      totalParts={totalParts}
      setSurveyMetrics={({ ids, accuracyArray, durations, totalTime }) => {
        const prev = surveyDataRef.current
        surveyDataRef.current = {
          ...prev,
          ids: [...(prev.ids ?? []), ...ids],
          test_accuracy: [...(prev.test_accuracy ?? []), ...accuracyArray],
          durations: [...(prev.durations ?? []), ...durations],
          totalTime: (prev.totalTime ?? 0) + totalTime,
          overallAccuracy:
            accuracyArray.filter(Boolean).length / accuracyArray.length,
        }
      }}
    />
  )
}

export default Treatment
