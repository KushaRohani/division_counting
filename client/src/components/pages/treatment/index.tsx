// src/components/pages/treatment.tsx
import React, { useState, useEffect } from 'react'
import TrainingPage from '../training'
import ExperimentPage from '../experiment'
import { fetchTrainingItems } from '../../ultilities/questionsTemplates'
import type { QuestionItem } from '../../ultilities/questionsTemplates'
import type { SurveyData } from '../../../App'

export interface TreatmentStep {
  ExplainComponent: React.FC<{ onNext: () => void }>
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
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<'explain' | 'train' | 'experiment'>(
    'explain'
  )
  const [trainingPool, setTrainingPool] = useState<QuestionItem[]>([])
  const current = steps[stepIndex]

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
      if (stepIndex < steps.length - 1) {
        setStepIndex(i => i + 1)
        setPhase('explain')
      } else {
        onFinish()
      }
    }
  }

  if (phase === 'explain') {
    return <current.ExplainComponent onNext={handleNext} />
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
