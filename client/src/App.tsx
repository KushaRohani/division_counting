// src/App.tsx
import { useRef, useState, useEffect } from 'react'
import CenteredPaper from './components/paper'
import LandingPage from './components/pages/landing'
import DisclaimerPage from './components/pages/disclaimer'
import InfoPage from './components/pages/information'
import SurveyPage from './components/pages/survey'
import Treatment, { TreatmentStep } from './components/pages/treatment'
import ThankYouPage from './components/pages/thankyou'
import Under18Page from './components/pages/under18'
import QuestionnairePage, { QuestionnaireData } from './components/pages/questionnaire'
import ExplainSlash from "./components/pages/explain/explainSlash"
import ExplainBar from "./components/pages/explain/explainBar"
import { fetchQuestionItems } from './components/ultilities/questionsTemplates'

export const PAGES = {
  landing: 'landing',
  disclaimer: 'disclaimer',
  info: 'info',
  survey: 'survey',
  under18: 'under18',
  treatment: 'treatment',
  questionnaire: 'questionnaire',
  thankyou: 'thankyou',
} as const
export type PageKey = keyof typeof PAGES

export interface SurveyData {
  name: string
  age: string
  sex: string
  ids?: string[]
  test_accuracy?: boolean[]
  durations?: number[]
  totalTime?: number
  overallAccuracy?: number
}

function App() {
  const [page, setPage] = useState<PageKey>(PAGES.landing)

  const surveyDataRef = useRef<SurveyData>({
    name: '',
    age: '',
    sex: '',
  })
  const experimentDataRef = useRef<string[]>([])
  const idsRef = useRef<string[]>([])
  const accuracyRef = useRef<boolean[]>([])
  const durationsRef = useRef<number[]>([])
  const questionnaireDataRef = useRef<QuestionnaireData>({
    easier_form: '',
    easier_form_thoughts: '',
    used_calculator: null,
    used_scratch_paper: null,
    difficulty_rating: null,
    programming_experience: null,
    preferred_language: '',
    highest_math_course: '',
    used_vertical_division: null,
  })

  const [treatments, setTreatments] = useState<TreatmentStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const items = await fetchQuestionItems()
      const rawItems = items.filter(q => q.id.startsWith('01'))
      const latexItems = items.filter(q => q.id.startsWith('02'))

      setTreatments([
        {
          ExplainComponent: ExplainSlash,
          questions: rawItems,
        },
        {
          ExplainComponent: ExplainBar,
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
        return <LandingPage setPage={() => setPage(PAGES.disclaimer)} />

      case PAGES.disclaimer:
        return (
          <DisclaimerPage
            setPage={() => setPage(PAGES.info)}
            backPage={() => setPage(PAGES.landing)}
          />
        )

      case PAGES.info:
        return (
          <InfoPage
            setPage={() => setPage(PAGES.survey)}
            backPage={() => setPage(PAGES.disclaimer)}
          />
        )

      case PAGES.survey:
        return (
          <SurveyPage
            setPage={() => setPage(PAGES.treatment)}
            setUnder18Page={() => setPage(PAGES.under18)}
            backPage={() => setPage(PAGES.info)}
            surveyData={surveyDataRef.current}
            setSurveyData={data => {
              surveyDataRef.current = data
            }}
          />
        )

      case PAGES.under18:
        return (
          <Under18Page
            setPage={() => setPage(PAGES.landing)}
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
            onFinish={() => setPage(PAGES.questionnaire)}
          />
        )

      case PAGES.questionnaire:
        return (
          <QuestionnairePage
            setPage={() => setPage(PAGES.thankyou)}
            questionnaireData={questionnaireDataRef.current}
            setQuestionnaireData={data => {
              questionnaireDataRef.current = data
            }}
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
            questionnaireData={questionnaireDataRef.current}
          />
        )

      default:
        return <LandingPage setPage={() => setPage(PAGES.info)} />
    }
  }

  return <CenteredPaper>{renderPage()}</CenteredPaper>
}

export default App
