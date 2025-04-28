// src/App.tsx
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import CenteredPaper from './components/paper'
import LandingPage from './components/pages/landing'
// import InfoPage from './components/pages/information'
import SurveyPage from './components/pages/survey'
import TrainingPage from './components/pages/training'
import ExperimentPage from './components/pages/experiment'
import ThankYouPage from './components/pages/thankyou'
import ExplainPage from './components/pages/explain'
import { ProgrammingLanguage } from '../../shared/languageOptions'
import { getQuestions, GroupEnum } from './components/ultilities/questionsTemplates'

export const PAGES = {
  landing: 'landing',
  info: 'info',
  survey: 'survey',
  training: 'training',
  experiment: 'experiment',
  thankyou: 'thankyou',
  explain: 'explain',
} as const
export type PageKey = keyof typeof PAGES

export interface SurveyData {
  yearsProgramming: string
  age: string
  sex: string
  language: ProgrammingLanguage | ''
  email: string
  test_accuracy?: boolean[]
  durations?: number[]
}

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState<PageKey>(PAGES.landing)
  const surveyDataRef = useRef<SurveyData>({ yearsProgramming: '', age: '', sex: '', language: '', email: '' })
  const experimentDataRef = useRef<string[]>([])
  const durationsRef = useRef<number[]>([])
  const accuracyRef = useRef<boolean[]>([])

  const [questions, setQuestions] = useState<string[]>([])
  const [assignmentId, setAssignmentId] = useState<number>(0)
  const [groupEnum, setGroupEnum] = useState<GroupEnum | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // On mount, fetch group and assignment, then generate questions
  useEffect(() => {
    async function initExperiment() {
      try {
        const res = await axios.get(`${apiUrl}/kusha/next-group`)
        const { group: groupRaw, assignmentId: id } = res.data
        const groupValue = (groupRaw === GroupEnum.latex ? GroupEnum.latex : GroupEnum.string) as GroupEnum
        setGroupEnum(groupValue)
        setAssignmentId(id)

        console.log(`Assigned to group: ${GroupEnum[groupValue]} (` + groupValue + `)`)

        // generate questions locally (indices 4-13); could vary by group
        const qs = Array.from({ length: 10 }, (_, i) => getQuestions(i + 4))
        setQuestions(qs)
      } catch (err) {
        console.error('Error fetching next-group:', err)
      } finally {
        setLoading(false)
      }
    }
    initExperiment()
  }, [])

  const setSurveyData = (data: SurveyData) => {
    surveyDataRef.current = data
    setPage(PAGES.training)
  }

  const setSurveyMetrics = ({ accuracyArray, durations }: { accuracyArray: boolean[]; durations: number[] }) => {
    surveyDataRef.current.test_accuracy = accuracyArray
    surveyDataRef.current.durations = durations
  }

  const clearSurveyData = () => {
    surveyDataRef.current = { yearsProgramming: '', age: '', sex: '', language: '', email: '' }
  }

  const renderPage = () => {
    switch (page) {
      case PAGES.landing:
        return <LandingPage setPage={setPage} />
      // case PAGES.info:
      //   return <InfoPage setPage={setPage} />
      case PAGES.survey:
        return (
          <SurveyPage
            setPage={setPage}
            surveyData={surveyDataRef.current}
            setSurveyData={setSurveyData}
          />
        )
      case PAGES.training:
        return <TrainingPage setPage={setPage} />
      case PAGES.experiment:
        if (loading || groupEnum === null) {
          return <div className="text-center p-8">Loading…</div>
        }
        return (
          <ExperimentPage
            setPage={setPage}
            surveyData={surveyDataRef.current}
            experimentDataRef={experimentDataRef}
            durationsRef={durationsRef}
            accuracyRef={accuracyRef}
            questions={questions}
            assignmentId={assignmentId}
            group={groupEnum}
            setSurveyMetrics={setSurveyMetrics}
            clearSurveyData={clearSurveyData}
          />
        )
      case PAGES.thankyou:
        return <ThankYouPage />
      case PAGES.explain:
        return <ExplainPage setPage={setPage} />
      default:
        return <LandingPage setPage={setPage} />
    }
  }

  return <CenteredPaper>{renderPage()}</CenteredPaper>
}

export default App
