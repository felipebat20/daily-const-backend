import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash } from 'bcryptjs';

import { exclude } from '../helpers/exclude';
import { createUser } from "../services/AuthService";

const prisma = new PrismaClient();

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    res.json({ email, password });
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
      res.status(400).send(err);
    }
  }
}
