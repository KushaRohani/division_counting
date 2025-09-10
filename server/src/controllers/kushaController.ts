// src/server/controllers/experimentController.ts

import { RequestHandler } from 'express'
import { PrismaClient, Sex } from '@prisma/client'
import { stringify } from 'csv-stringify/sync'
import cron from 'node-cron'

const prisma = new PrismaClient()

// Every minute, clean up assignments older than 30 minutes that never completed
cron.schedule('*/1 * * * *', async () => {
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000)
    const { count } = await prisma.assignment.updateMany({
      where: {
        completed: false,
        abandoned: false,
        createdAt: { lt: cutoff },
      },
      data: {
        abandoned: true,
      },
    });
    if (count > 0) {
      console.log(`🗑  Cleaned up ${count} abandoned assignments (older than 30m)`)
    }
  } catch (err) {
    console.error('Error cleaning up abandoned assignments:', err)
  }
})

function parseSex(input: string): Sex {
  switch (input.toLowerCase()) {
    case 'male':   return Sex.male
    case 'female': return Sex.female
    case 'other':  return Sex.other
    default:
      throw new Error(`Invalid sex: ${input}`)
  }
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
    } = req.body as Record<string, any>

    const parsedAge = parseInt(age, 10)
    const safeAge = isNaN(parsedAge) ? 0 : parsedAge

    const sexEnum = parseSex(sexInput)

    console.log('📥 Creating experiment entry with:', {
      name,
      safeAge,
      sexEnum,
      ids,
      task_accuracy,
      durations,
      totalTime,
      overallAccuracy,
    })

    const entry = await prisma.$transaction(async tx => {
      // create the name record first
      const nameRecord = await tx.name.create({
        data: {
          name: name.trim(),
        },
      })

      // create the main experiment record
      const created = await tx.experiment_data.create({
        data: {
          name_id: nameRecord.id,
          age: safeAge,
          sex: sexEnum,
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

      return created
    })

    res.status(201).json(entry)
  } catch (err) {
    console.error('❌ Error in createExperimentEntry:', err)
    next(err)
  }
}

export const getNextGroup: RequestHandler = async (req, res, next) => {
  try {
    console.log("Getting next group")
    const question_size_raw = req.query.question_size;
    const syntax_size_raw = req.query.syntax_size;
    const group_id_raw = req.query.group_id;

    const question_size = Number(question_size_raw);
    const syntax_size = Number(syntax_size_raw);
    const group_id = Number(group_id_raw);

    if (
      !question_size_raw || !syntax_size_raw || !group_id_raw ||
      isNaN(question_size) || isNaN(syntax_size) || isNaN(group_id) ||
      question_size <= 0 || syntax_size <= 0 || group_id <= 0
    ) {
      res.status(400).json({ 
        error: 'Invalid input',
        question_size: question_size_raw,
        syntax_size: syntax_size_raw,
      });
      return;
    }

    const { adjustedQuestionArray, adjustedSyntaxArray, assignmentId } = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(42)`;

      const questionArray = Array.from({ length: question_size }, (_, i) => i + 1);
      const syntaxArray = Array.from({ length: question_size }, (_, i) => i + 1);

      const abandonedAssignment = await tx.assignment.findFirst({
        where: {
          group: group_id,
          abandoned: true,
        },
        orderBy: {
          latinCounter: 'asc',
        },
      });

      let newLatinCounter: number;
      let assignmentId: number;

      if (abandonedAssignment) {
        await tx.assignment.update({
          where: { id: abandonedAssignment.id },
          data: {
            abandoned: false,
            completed: false,
          },
        });

        newLatinCounter = abandonedAssignment.latinCounter;
        assignmentId = abandonedAssignment.id;
      } else {
        const maxLatinCounter = await tx.assignment.aggregate({
          where: { group: group_id },
          _max: {
            latinCounter: true,
          },
        });

        const lastLatinCounter = maxLatinCounter._max.latinCounter ?? -1;
        newLatinCounter = lastLatinCounter + 1;

        const newAssignment = await tx.assignment.create({
          data: {
            completed: false,
            abandoned: false,
            latinCounter: newLatinCounter,
            group: group_id,
          },
        });

        assignmentId = newAssignment.id;
      }

      const adjustedQuestionArray = questionArray.map(
        val => ((val + newLatinCounter - 1) % question_size) + 1
      );

      const adjustedSyntaxArray = syntaxArray.map(
        val => ((((val - newLatinCounter - 1) % syntax_size) + syntax_size) % syntax_size) + 1
      );

      return {
        adjustedQuestionArray,
        adjustedSyntaxArray,
        assignmentId,
      };
    });

    res.json({
      questionArray: adjustedQuestionArray,
      syntaxArray: adjustedSyntaxArray,
      assignmentId,
    });
  } catch (err) {
    console.error('❌ Error in getNextGroup:', err);
    next(err);
  }
};

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
