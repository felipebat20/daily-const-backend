import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';

const router = Router();

router
  .post('/login', AuthController.login)
  .post('/register', AuthController.register);

module.exports = router;