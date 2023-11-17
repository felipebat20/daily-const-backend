import { Router } from 'express';

import { StreakController } from '../controllers/StreakController';

const router = Router();

const streakController = new StreakController();

router
  .get('/streaks', streakController.index)
  .post('/streaks', streakController.store)
  .get('/streaks/:streak_id', streakController.show)
  .post('/streaks/:streak_id/attach', streakController.attach)
  .delete('/streaks/:streak_id/detach', streakController.detach)
  .get('/streaks/:streak_id/focus_summaries', streakController.focus_summaries)
  .put('/streaks/:streak_id', streakController.update)
  .delete('/streaks/:streak_id', streakController.delete);

export default router;
