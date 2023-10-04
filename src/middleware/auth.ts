import { HttpCode } from '../enum/httpStatusCodes';
import { Request, Response, NextFunction } from 'express';
import { decode, verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string
}

interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (! token) {
    return res.status(HttpCode.UNAUTHENTICATED).send({ message: 'Missing access token' });
  }

  const [, accesstoken] = token?.split(' ') || '';

  try {
    await verify(accesstoken, process.env.JWT_SECRET || '');

    const { id } = await decode(accesstoken) as JwtPayload;

    req.user = await prisma.users.findUnique({ where: { id } }) as User;

    next();
  } catch (err) {
    return res.status(HttpCode.UNAUTHENTICATED).send({ message: 'unauthenticated' });
  }
};
