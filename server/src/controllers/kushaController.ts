// src/server/controllers/experimentController.ts

import { RequestHandler } from 'express'
import { PrismaClient} from '@prisma/client'
import { stringify } from 'csv-stringify/sync'

const prisma = new PrismaClient()

function sanitizeSex(input: string): string {
  // Trim whitespace and return the input as-is
  // No validation needed since we're accepting any text input
  return input.trim()
}

/**
 * POST /
 * Handles survey + experiment submission for Experiment_data.
 */
export const createExperimentEntry: RequestHandler = async (req, res, next) => {

  console.log('📥 Received experiment entry:', req.body)

  try {
    const {
      name,
      age,
      sex: sexInput,
      ids,
      task_accuracy,
      durations,
      totalTime,
      overallAccuracy,
      // Questionnaire data
      easier_form,
      easier_form_thoughts,
      used_calculator,
      used_scratch_paper,
      difficulty_rating,
      programming_experience,
      preferred_language,
      highest_math_course,
      used_vertical_division,
    } = req.body as Record<string, any>

    const parsedAge = parseInt(age, 10)
    const safeAge = isNaN(parsedAge) ? 0 : parsedAge

    const sexString = sanitizeSex(sexInput)

    console.log('📥 Creating experiment entry with:', {
      name,
      safeAge,
      sexString,
      ids,
      task_accuracy,
      durations,
      totalTime,
      overallAccuracy,
    })

    const entry = await prisma.$transaction(async (tx) => {
      // Create name record separately (not linked to experiment data)
      if (name && name.trim()) {
        await tx.name.create({
          data: {
            name: name.trim(),
          },
        })
      }

      // create the main experiment record (without name_id)
      const created = await tx.experiment_data.create({
        data: {
          age: safeAge,
          sex: sexString,
          accuracy: overallAccuracy ?? 0,
          task_accuracy,
          task_ids: ids,
          total_time: totalTime ?? 0,
          per_task_time: durations,
        },
      })

      // insert per-question rows
      const perQuestionData = ids.map((questionId: string, index: number) => ({
        question_id: parseInt(questionId, 10),
        user_id: created.id,
        result: task_accuracy[index],
        time: durations[index],
      }))

      await tx.experiment_per_question.createMany({
        data: perQuestionData,
      })

      // Create questionnaire entry if questionnaire data is provided
      if (
        easier_form !== undefined ||
        easier_form_thoughts !== undefined ||
        used_calculator !== undefined ||
        used_scratch_paper !== undefined ||
        difficulty_rating !== undefined ||
        programming_experience !== undefined ||
        preferred_language !== undefined ||
        highest_math_course !== undefined ||
        used_vertical_division !== undefined
      ) {
        await tx.questionnaire.create({
          data: {
            experiment_data_id: created.id,
            easier_form: easier_form || null,
            easier_form_thoughts: easier_form_thoughts || null,
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
            programming_experience:
              programming_experience !== undefined
                ? programming_experience === true ||
                  programming_experience === 'true'
                : null,
            preferred_language: preferred_language || null,
            highest_math_course: highest_math_course || null,
            used_vertical_division:
              used_vertical_division !== undefined
                ? used_vertical_division === true ||
                  used_vertical_division === 'true'
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
