import { Router } from 'express';
import {
  createExperimentEntry,
  getAllExperimentEntriesCsv,
  getExperimentEntryById,
  createNameEntry,
} from '../controllers/kushaController';

const router = Router();

// Experiment routes
//router.get('/', getAllExperimentEntriesCsv);
router.post('/', createExperimentEntry);
router.post('/name', createNameEntry);
//router.get('/:id', getExperimentEntryById);

export default router;
