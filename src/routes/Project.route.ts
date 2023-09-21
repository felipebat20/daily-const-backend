import { Router } from 'express';

import { ProjectController } from '@controllers/ProjectController';

const projectController = new ProjectController();

const router = Router();
router
  .get('/projects', projectController.index)
  .post('/projects', projectController.store);
  // .get('/project/:id', ProjectController.show)
  // .delete('/project/:id', ProjectController.delete)
  // .put('/project/:id', ProjectController.update);

  export default router;
