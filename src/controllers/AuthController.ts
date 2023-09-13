import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash } from 'bcryptjs';

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
      const user = await prisma.users.create({ data: { name, email, password: hash_password }})

      res.status(201).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  }
}
