import { Router } from 'express';
import {
  createExperimentEntry,
  getAllExperimentEntriesCsv,
  getExperimentEntryById,
} from '../controllers/kushaController';

const router = Router();

// Experiment routes
//router.get('/', getAllExperimentEntriesCsv);
router.post('/', createExperimentEntry);
//router.get('/:id', getExperimentEntryById);

export default router;
