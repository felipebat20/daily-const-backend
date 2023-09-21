import { Request, Response } from 'express';

import { findAllUsers } from '../services/UserService';

export class UserController {
  static async index(req: Request, res: Response) {
    const users = await findAllUsers();

    res.status(200).send(users);
  }
}
