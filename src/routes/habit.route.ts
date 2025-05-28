import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitComplete,
  getHabitSummary,
} from '../controllers/habit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  CreateHabitSchema,
  UpdateHabitSchema,
} from '../validators/habit.schema';
import { Router } from 'express';

const router = Router();

router.use(authenticate);

router.post('/new', validate(CreateHabitSchema), createHabit);
router.get('/', getHabits);
router.patch('/:id', validate(UpdateHabitSchema), updateHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/complete', markHabitComplete);
router.get('/summary', getHabitSummary);

export default router;
