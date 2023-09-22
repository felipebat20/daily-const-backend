import { Router } from 'express';

import { FocusedSessionsController } from '@controllers/FocusedSessionsController';

const router = Router();

const focusedSessionController = new FocusedSessionsController();

router
  .get('/sessions', focusedSessionController.listUserFocusedSessions)
  .get('/tasks/:task_id/sessions', focusedSessionController.listTaskFocusedSessions)
  .post('/tasks/:task_id/sessions', focusedSessionController.store)
  .get('/tasks/:task_id/sessions/:session_id', focusedSessionController.show)
  .put('/tasks/:task_id/sessions/:session_id', focusedSessionController.update)
  .delete('/tasks/:task_id/sessions/:session_id', focusedSessionController.delete);

export default router;
