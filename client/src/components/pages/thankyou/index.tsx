// src/components/pages/thankyou.tsx
import React, { useEffect } from 'react'
import axios from 'axios'
import type { SurveyData } from '../../../App'
import type { QuestionnaireData } from '../questionnaire'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface ThankYouPageProps {
  surveyData: SurveyData & {
    ids: string[]
    test_accuracy: boolean[]
    durations: number[]
    totalTime: number
    overallAccuracy: number
  }
  questionnaireData: QuestionnaireData
  setPage: () => void
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({
  surveyData,
  questionnaireData,
}) => {
  useEffect(() => {
    ;(async () => {
      try {
        const {
          test_accuracy,
          ...rest /* yearsProgramming, age, sex, language, email, ids, durations, totalTime, overallAccuracy */
        } = surveyData

        await axios.post(`${apiUrl}/experiment`, {
          ...rest,
          task_accuracy: test_accuracy,
          // Include questionnaire data
          easier_form: questionnaireData.easier_form || undefined,
          easier_form_thoughts: questionnaireData.easier_form_thoughts || undefined,
          used_calculator: questionnaireData.used_calculator,
          used_scratch_paper: questionnaireData.used_scratch_paper,
          difficulty_rating: questionnaireData.difficulty_rating,
          programming_experience: questionnaireData.programming_experience,
          preferred_language: questionnaireData.preferred_language || undefined,
          highest_math_course: questionnaireData.highest_math_course || undefined,
          used_vertical_division: questionnaireData.used_vertical_division,
        })
      } catch (error) {
        console.error('Submit error', error)
      }
    })()
  }, [surveyData, questionnaireData])

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      <h1 className="text-4xl font-extrabold text-white text-center mb-6">
        Thank You!
      </h1>

      <p className="text-white text-md text-center max-w-xl mb-8">
        Your input is valuable and helps us better understand how people interpret division syntax.
      </p>
    </div>
  )
}

export default ThankYouPage
