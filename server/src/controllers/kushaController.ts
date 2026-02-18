// src/server/controllers/experimentController.ts

import { RequestHandler } from 'express'
import { PrismaClient} from '@prisma/client'
import { stringify } from 'csv-stringify/sync'

const prisma = new PrismaClient()

function sanitizeSex(input: unknown): string {
  if (input == null) return ''
  return String(input).trim()
}

/**
 * POST /name
 * Handles saving name information for extra credit (separate from experiment data).
 * Only saves if all four fields (first_name, last_name, class, section) are provided.
 */
export const createNameEntry: RequestHandler = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      class: className,
      section,
    } = req.body as Record<string, any>

    // Only save if all optional fields are provided
    const hasAllFields = 
      first_name && first_name.trim() &&
      last_name && last_name.trim() &&
      className && className.trim() &&
      section && section.trim()

    if (!hasAllFields) {
      // If not all fields are provided, just return success without saving
      res.status(200).json({ message: 'Name entry skipped - not all fields provided' })
      return
    }

    const nameEntry = await prisma.name.create({
      data: {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        class: className.trim(),
        section: section.trim(),
      },
    })

    res.status(201).json(nameEntry)
  } catch (err) {
    console.error('❌ Error in createNameEntry:', err)
    next(err)
  }
}

/**
 * POST /
 * Handles survey + experiment submission for Experiment_data.
 */
export const createExperimentEntry: RequestHandler = async (req, res, next) => {

  //console.log('📥 Received experiment entry:', req.body)

  try {
    const {
      name,
      age,
      sex: sexInput,
      years_programming,
      school_year,
      study_major,
      last_math_class_years,
      preferred_language,
      highest_math_course,
      used_vertical_division,
      ids,
      task_accuracy,
      durations,
      totalTime,
      overallAccuracy,
      // Optional name fields for extra credit (already saved separately)
      first_name,
      last_name,
      class: className,
      section,
      // Questionnaire data
      easier_form,
      easier_form_thoughts,
      used_calculator,
      used_scratch_paper,
      difficulty_rating,
    } = req.body as Record<string, any>

    const parsedAge = parseInt(age, 10)
    const safeAge = isNaN(parsedAge) ? 0 : parsedAge

    const sexString = sanitizeSex(sexInput)

    // Normalize arrays so missing or invalid payloads don't throw
    const idsList = Array.isArray(ids) ? ids : []
    const taskAccuracyList = Array.isArray(task_accuracy) ? task_accuracy : []
    const durationsList = Array.isArray(durations) ? durations : []

    console.log('📥 Creating experiment entry with:', {
      name,
      safeAge,
      sexString,
      ids: idsList,
      task_accuracy: taskAccuracyList,
      durations: durationsList,
      totalTime,
      overallAccuracy,
    })

    const entry = await prisma.$transaction(async (tx) => {
      // Note: Name entries are now saved separately when the user clicks Next on the survey page
      // This ensures the name data is saved early and is not linked to experiment results

      // create the main experiment record (without name_id)
      const created = await tx.experiment_data.create({
        data: {
          age: safeAge,
          sex: sexString,
          years_programming: years_programming || '',
          school_year: school_year || '',
          study_major: study_major || '',
          last_math_class_years: last_math_class_years || '',
          preferred_language: preferred_language || '',
          highest_math_course: highest_math_course || '',
          used_vertical_division: used_vertical_division || '',
          accuracy: overallAccuracy ?? 0,
          task_accuracy: taskAccuracyList,
          task_ids: idsList,
          total_time: totalTime ?? 0,
          per_task_time: durationsList,
        },
      })

      // insert per-question rows (only valid question_id; coerce result/time to avoid Prisma errors)
      const perQuestionData = idsList
        .map((questionId: string, index: number) => {
          const questionIdNum = parseInt(String(questionId), 10)
          return {
            question_id: questionIdNum,
            user_id: created.id,
            result: Boolean(taskAccuracyList[index]),
            time: Math.floor(Number(durationsList[index])) || 0,
          }
        })
        .filter((row) => !Number.isNaN(row.question_id))

      if (perQuestionData.length > 0) {
        await tx.experiment_per_question.createMany({
          data: perQuestionData,
        })
      }

      // Create questionnaire entry if questionnaire data is provided
      if (
        easier_form !== undefined ||
        easier_form_thoughts !== undefined ||
        used_calculator !== undefined ||
        used_scratch_paper !== undefined ||
        difficulty_rating !== undefined
      ) {
        // Coerce questionnaire text fields to string or null (Prisma expects String?)
        const safeEasierForm =
          easier_form != null && typeof easier_form === 'string'
            ? easier_form.trim() || null
            : null
        const safeEasierFormThoughts =
          easier_form_thoughts != null && typeof easier_form_thoughts === 'string'
            ? easier_form_thoughts.trim() || null
            : null

        await tx.questionnaire.create({
          data: {
            experiment_data_id: created.id,
            easier_form: safeEasierForm,
            easier_form_thoughts: safeEasierFormThoughts,
            used_calculator:
              used_calculator !== undefined
                ? used_calculator === true || used_calculator === 'true'
                : null,
            used_scratch_paper:
              used_scratch_paper !== undefined
                ? used_scratch_paper === true || used_scratch_paper === 'true'
                : null,
            difficulty_rating:
              difficulty_rating !== undefined
                ? parseInt(difficulty_rating, 10) || null
                : null,
          },
        })
      }

      return created
    })

    res.status(201).json(entry)
  } catch (err) {
    console.error('❌ Error in createExperimentEntry:', err)
    next(err)
  }
}


/**
 * GET /:id
 * Retrieve a single Experiment_data entry by its ID.
 */
export const getExperimentEntryById: RequestHandler = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' })
      return
    }
    const entry = await prisma.experiment_data.findUnique({ 
      where: { id }
    })
    if (!entry) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(entry)
  } catch (err) {
    console.error('❌ Error in getExperimentEntryById:', err)
    next(err)
  }
}

/**
 * GET /
 * Download CSV of all Experiment_data results.
 */
export const getAllExperimentEntriesCsv: RequestHandler = async (_req, res, next) => {
  try {
    const data = await prisma.experiment_data.findMany()
    const csv  = stringify(data, { header: true })
    res
      .status(200)
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', 'attachment; filename="experiment_data.csv"')
      .send(csv)
  } catch (err) {
    console.error('❌ Error in getAllExperimentEntriesCsv:', err)
    next(err)
  }
}
