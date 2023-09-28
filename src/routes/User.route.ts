import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import auth from '../middleware/auth';

const router = Router();

router
  .use(auth)
  .get('/users', UserController.index);

  export default router;
