import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SurveyData } from './../../../App';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface SurveyPageProps {
  setPage: () => void;
  setUnder18Page: () => void;
  backPage: () => void;
  surveyData: SurveyData;
  setSurveyData: (data: SurveyData) => void;
}

const SurveyPage: React.FC<SurveyPageProps> = ({ setPage, setUnder18Page, surveyData, setSurveyData, backPage }) => {
  const [form, setForm] = useState(surveyData);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid =
    form.age.trim() !== '' &&
    form.years_programming.trim() !== '' &&
    form.school_year.trim() !== '' &&
    form.study_major.trim() !== '' &&
    form.last_math_class_years.trim() !== '' &&
    form.preferred_language.trim() !== '' &&
    form.highest_math_course.trim() !== '' &&
    form.used_vertical_division.trim() !== '';

  const handleNext = async () => {
    if (isValid) {
      setSurveyData(form);
      
      // Check if all optional name fields are provided and save to database
      const hasAllOptionalFields = 
        form.first_name && form.first_name.trim() &&
        form.last_name && form.last_name.trim() &&
        form.class && form.class.trim() &&
        form.section && form.section.trim();

      if (hasAllOptionalFields) {
        try {
          await axios.post(`${apiUrl}/experiment/name`, {
            first_name: form.first_name,
            last_name: form.last_name,
            class: form.class,
            section: form.section,
          });
        } catch (error) {
          console.error('Error saving name entry:', error);
          // Continue even if name save fails
        }
      }

      // Check if user is under 18
      const age = parseInt(form.age);
      if (age < 18) {
        setUnder18Page();
      } else {
        setPage(); // Continue to treatment page
      }
    } else {
      setAttemptedSubmit(true);
    }
  };

  useEffect(() => {
    setForm(surveyData); // preload data when returning
  }, [surveyData]);

  const getFieldClass = (field: keyof SurveyData): string => {
    // If the form hasn’t loaded yet, show the neutral style
    if (!form) return 'border-gray-600';
  
    // Read the value safely
    const value = form[field];
  
    // Only string fields can be trimmed; everything else is treated as “filled”
    const isBlank =
      typeof value === 'string' ? value.trim().length === 0 : false;
  
    return attemptedSubmit && isBlank ? 'border-red-500' : 'border-gray-600';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-10">
      {/* Back Button */}
      <div className="w-full flex justify-start mb-4">
        <button
          className="text-white text-xl px-3 py-1 rounded hover:bg-blue-700 hover:text-white transition-colors border border-white/20 shadow-sm"
          onClick={() => backPage()}
        >
          ←
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 border-b border-gray-700 pb-2">
        Survey
      </h1>

      {/* Form */}
      <form className="w-full max-w-md text-white space-y-4">
        <div>
          <label className="block mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('age')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className="block mb-1">
            Gender
          </label>
          <input
            type="text"
            name="sex"
            value={form.sex}
            onChange={handleChange}
            placeholder="Enter the gender you identify as (optional)"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">
            Years of Programming Experience <span className="text-red-500">*</span>
          </label>
          <select
            name="years_programming"
            value={form.years_programming}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('years_programming')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select an option</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5+">5+</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            School Year <span className="text-red-500">*</span>
          </label>
          <select
            name="school_year"
            value={form.school_year}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('school_year')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select an option</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Study Major <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="study_major"
            value={form.study_major}
            onChange={handleChange}
            placeholder="Enter your study major"
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('study_major')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className="block mb-1">
            How long ago was your last math class? <span className="text-red-500">*</span>
          </label>
          <select
            name="last_math_class_years"
            value={form.last_math_class_years}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('last_math_class_years')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select an option</option>
            <option value="0">0 years</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            What's your preferred programming language, if any? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="preferred_language"
            value={form.preferred_language}
            onChange={handleChange}
            placeholder="e.g., Python, JavaScript, Java, etc. (or 'None')"
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('preferred_language')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className="block mb-1">
            What's the highest level math course you've taken? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="highest_math_course"
            value={form.highest_math_course}
            onChange={handleChange}
            placeholder="e.g., Calculus, Linear Algebra, etc."
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('highest_math_course')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className="block mb-1">
            Have you used a program or language that represents division vertically, such as Desmos or Mathematica? <span className="text-red-500">*</span>
          </label>
          <select
            name="used_vertical_division"
            value={form.used_vertical_division}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${getFieldClass('used_vertical_division')} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Optional fields section */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-300 font-medium">
              ⚠️ <span className="font-semibold">Optional Fields:</span> The following fields are optional. If provided, this information will <span className="font-semibold">not be linked to your results</span> and will only be used to provide extra credit if applicable.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name || ''}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name || ''}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={form.class || ''}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={form.section || ''}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
        Next
      </button>
    </div>
  );
};

export default SurveyPage;
