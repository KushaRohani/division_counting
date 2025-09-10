import { Router } from 'express';
import {
  createExperimentEntry,
  getAllExperimentEntriesCsv,
  getExperimentEntryById,
  getNextGroup,
} from '../controllers/kushaController';

const router = Router();

// Experiment routes
router.get('/', getAllExperimentEntriesCsv);
router.post('/', createExperimentEntry);
router.get('/next-group', getNextGroup);
router.get('/:id', getExperimentEntryById);

export default router;
