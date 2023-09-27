import { StreakController } from '@controllers/StreakController';
import { Router } from 'express';

const router = Router();

const streakController = new StreakController();

router
  .get('/streaks', streakController.index)
  .post('/streaks', streakController.store)
  .get('/streaks/:streak_id', streakController.show)
  .post('/streaks/:streak_id/attach')
  .delete('/streaks/:streak_id/dettach')
  .put('/streaks/:streak_id', streakController.update)
  .delete('/streaks/:streak_id', streakController.delete);

export default router;