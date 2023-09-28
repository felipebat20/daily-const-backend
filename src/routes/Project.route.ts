import { Router } from 'express';

import { ProjectController } from '../controllers/ProjectController';

const projectController = new ProjectController();

const router = Router();

router
  .get('/projects', projectController.index)
  .post('/projects', projectController.store)
  .get('/projects/:id', projectController.show)
  .delete('/projects/:id', projectController.delete)
  .put('/projects/:id', projectController.update);

export default router;
