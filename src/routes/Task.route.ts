import { Router } from 'express';

import { TaskController } from '../controllers/TaskController';
const router = Router();

router
  .get('/tasks', TaskController.index)
  .post('/tasks', TaskController.store)
  .post('/tasks/:id/inProgress', TaskController.inProgress)
  .patch('/tasks/:id/stopwatch', TaskController.stopWatch)
  .get('/tasks/:id', TaskController.show)
  .delete('/tasks/:id', TaskController.delete)
  .put('/tasks/:id', TaskController.update);

export default router;
