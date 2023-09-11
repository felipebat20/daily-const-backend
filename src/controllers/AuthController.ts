import { Request, Response } from "express";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;


    res.json({ email, password });
  }
}
