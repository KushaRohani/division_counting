import React, { useState, useEffect } from 'react';
import { SurveyData } from '../../../App';

export interface QuestionnaireData {
  easier_form: string;
  easier_form_thoughts: string;
  used_calculator: boolean | null;
  used_scratch_paper: boolean | null;
  difficulty_rating: number | null;
  programming_experience: boolean | null;
  preferred_language: string;
  highest_math_course: string;
  used_vertical_division: boolean | null;
}

interface QuestionnairePageProps {
  setPage: () => void;
  questionnaireData: QuestionnaireData;
  setQuestionnaireData: (data: QuestionnaireData) => void;
  surveyData: SurveyData;
  setSurveyData: (data: SurveyData) => void;
}

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({
  setPage,
  questionnaireData,
  setQuestionnaireData,
  surveyData,
  setSurveyData,
}) => {
  const [form, setForm] = useState<QuestionnaireData>(questionnaireData);
  const [name, setName] = useState(surveyData.name);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    setName(surveyData.name); // Sync name when surveyData changes
  }, [surveyData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else if (type === 'radio') {
      const boolValue = value === 'true';
      setForm({ ...form, [name]: boolValue });
    } else if (name === 'difficulty_rating') {
      setForm({ ...form, [name]: value ? parseInt(value, 10) : null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const isValid = name.trim() !== '';

  const handleNext = () => {
    if (isValid) {
      setQuestionnaireData(form);
      setSurveyData({ ...surveyData, name: name.trim() });
      setPage();
    } else {
      setAttemptedSubmit(true);
    }
  };

  const getFieldClass = (): string => {
    return 'border-gray-600';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10 max-h-screen overflow-y-auto">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 border-b border-gray-700 pb-2">
        Post-Study Questionnaire
      </h1>

      {/* Form */}
      <form className="w-full max-w-2xl text-white space-y-6">
        {/* Name field at the beginning */}
        <div>
          <label className="block mb-2 text-lg">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${
              attemptedSubmit && name.trim() === '' ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Question 1: Which form of division felt easier to work with? */}
        <div>
          <label className="block mb-2 text-lg">
            Which form of division felt easier to work with?
          </label>
          <select
            name="easier_form"
            value={form.easier_form}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass()} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select an option</option>
            <option value="slash">Slash (/)</option>
            <option value="bar">Bar (÷)</option>
            <option value="both">Both were equally easy</option>
            <option value="neither">Neither was easy</option>
          </select>
        </div>

        {/* Question 2: Please provide any thoughts on why ___ */}
        {form.easier_form && (
          <div>
            <label className="block mb-2 text-lg">
              Please provide any thoughts on why{' '}
              {form.easier_form === 'slash'
                ? 'slash'
                : form.easier_form === 'bar'
                  ? 'bar'
                  : form.easier_form === 'both'
                    ? 'both were equally easy'
                    : 'neither was easy'}
              {' '}felt easier:
            </label>
            <textarea
              name="easier_form_thoughts"
              value={form.easier_form_thoughts}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass()} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              placeholder="Enter your thoughts here..."
            />
          </div>
        )}

        {/* Question 3: Did you use a calculator? */}
        <div>
          <label className="block mb-2 text-lg">
            Did you use a calculator?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="used_calculator"
                value="true"
                checked={form.used_calculator === true}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="used_calculator"
                value="false"
                checked={form.used_calculator === false}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Question 4: Did you use scratch paper? */}
        <div>
          <label className="block mb-2 text-lg">
            Did you use scratch paper?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="used_scratch_paper"
                value="true"
                checked={form.used_scratch_paper === true}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="used_scratch_paper"
                value="false"
                checked={form.used_scratch_paper === false}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Question 5: Difficulty rating 1-7 */}
        <div>
          <label className="block mb-2 text-lg">
            How difficult did you find the questions to be? (1 = Very easy, 7 =
            Very hard)
          </label>
          <select
            name="difficulty_rating"
            value={form.difficulty_rating ?? ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass()} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select a rating</option>
            <option value="1">1 - Very easy</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7 - Very hard</option>
          </select>
        </div>

        {/* Question 6: Do you have experience programming? */}
        <div>
          <label className="block mb-2 text-lg">
            Do you have experience programming?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="programming_experience"
                value="true"
                checked={form.programming_experience === true}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="programming_experience"
                value="false"
                checked={form.programming_experience === false}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Question 7: Preferred programming language */}
        <div>
          <label className="block mb-2 text-lg">
            What's your preferred programming language, if any?
          </label>
          <input
            type="text"
            name="preferred_language"
            value={form.preferred_language}
            onChange={handleChange}
            placeholder="e.g., Python, JavaScript, Java, etc."
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass()} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Question 8: Highest level math course */}
        <div>
          <label className="block mb-2 text-lg">
            What's the highest level math course you've taken?
          </label>
          <input
            type="text"
            name="highest_math_course"
            value={form.highest_math_course}
            onChange={handleChange}
            placeholder="e.g., Calculus, Linear Algebra, etc."
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass()} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Question 9: Used vertical division programs */}
        <div>
          <label className="block mb-2 text-lg">
            Have you used a program or language that represents division
            vertically, such as Desmos or Mathematica?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="used_vertical_division"
                value="true"
                checked={form.used_vertical_division === true}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="used_vertical_division"
                value="false"
                checked={form.used_vertical_division === false}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
      </form>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className={`mt-10 py-2 px-6 font-semibold rounded shadow-md transition-all ${
          isValid
            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default QuestionnairePage;

