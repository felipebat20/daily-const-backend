import { Request, Response } from 'express';
import { hash } from 'bcryptjs';

import { exclude } from '../helpers/exclude';
import { createUser, loginUser } from '../services/AuthService';
import { AppError } from '../exceptions/AppError';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const data = await loginUser({ email, password });

      res.status(201).send(data);
    } catch(err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send('Internal server error');
    }
  }

  static async register(req: Request, res: Response) {
    const { name, password, email } = req.body;

    const hash_password = await hash(password, 8);

    try {
      const user = await createUser({
        name,
        password: hash_password,
        email,
      });

      res.status(201).send(exclude(user, ['password']));
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send('Internal server error');
    }
  }
}
