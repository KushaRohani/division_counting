// src/App.tsx
import React, { useRef, useState, useEffect } from 'react'
import CenteredPaper from './components/paper'
import LandingPage from './components/pages/landing'
import InfoPage from './components/pages/information'
import SurveyPage from './components/pages/survey'
import Treatment, { TreatmentStep } from './components/pages/treatment'
import ThankYouPage from './components/pages/thankyou'
import { ProgrammingLanguage } from '../../shared/languageOptions'
import ExplainNewline from "./components/pages/explain/explainNewLine"
import ExplainTab from "./components/pages/explain/explainTab"
import { fetchQuestionItems, QuestionItem } from './components/ultilities/questionsTemplates'

export const PAGES = {
  landing: 'landing',
  info: 'info',
  survey: 'survey',
  treatment: 'treatment',
  thankyou: 'thankyou',
} as const
export type PageKey = keyof typeof PAGES

export interface SurveyData {
  yearsProgramming: string
  age: string
  sex: string
  language: ProgrammingLanguage | ''
  email: string
  ids?: string[]
  test_accuracy?: boolean[]
  durations?: number[]
  totalTime?: number
  overallAccuracy?: number
}

function App() {
  const [page, setPage] = useState<PageKey>(PAGES.landing)

  const surveyDataRef = useRef<SurveyData>({
    yearsProgramming: '',
    age: '',
    sex: '',
    language: '',
    email: '',
  })
  const experimentDataRef = useRef<string[]>([])
  const idsRef = useRef<string[]>([])
  const accuracyRef = useRef<boolean[]>([])
  const durationsRef = useRef<number[]>([])

  const [treatments, setTreatments] = useState<TreatmentStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const items = await fetchQuestionItems()
      const rawItems = items.filter(q => q.id.startsWith('01'))
      const latexItems = items.filter(q => q.id.startsWith('02'))

      setTreatments([
        {
          ExplainComponent: ExplainNewline,
          questions: rawItems,
        },
        {
          ExplainComponent: ExplainTab,
          questions: latexItems,
        },
      ])
      setLoading(false)
    }
    init().catch(console.error)
  }, [])

  const renderPage = () => {
    switch (page) {
      case PAGES.landing:
        return <LandingPage setPage={() => setPage(PAGES.info)} />

      case PAGES.info:
        return (
          <InfoPage
            setPage={() => setPage(PAGES.survey)}
            backPage={() => setPage(PAGES.landing)}
          />
        )

      case PAGES.survey:
        return (
          <SurveyPage
            setPage={() => setPage(PAGES.treatment)}
            backPage={() => setPage(PAGES.info)}
            surveyData={surveyDataRef.current}
            setSurveyData={data => {
              surveyDataRef.current = data
            }}
          />
        )

      case PAGES.treatment:
        if (loading) {
          return <div className="text-center p-8 text-white">Loading…</div>
        }
        return (
          <Treatment
            steps={treatments}
            surveyDataRef={surveyDataRef}
            experimentDataRef={experimentDataRef}
            idsRef={idsRef}
            durationsRef={durationsRef}
            accuracyRef={accuracyRef}
            onFinish={() => setPage(PAGES.thankyou)}
          />
        )

      case PAGES.thankyou:
        return (
          <ThankYouPage
            setPage={() => setPage(PAGES.landing)}
            surveyData={{
              ...surveyDataRef.current,
              ids: surveyDataRef.current.ids ?? [],
              test_accuracy: surveyDataRef.current.test_accuracy ?? [],
              durations: surveyDataRef.current.durations ?? [],
              totalTime: surveyDataRef.current.totalTime ?? 0,
              overallAccuracy: surveyDataRef.current.overallAccuracy ?? 0,
            }}
          />
        )

      default:
        return <LandingPage setPage={() => setPage(PAGES.info)} />
    }
  }

  return <CenteredPaper>{renderPage()}</CenteredPaper>
}

export default App
