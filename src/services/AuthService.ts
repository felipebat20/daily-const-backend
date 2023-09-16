import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AppError } from '@exceptions/AppError';
import { HttpCode } from '@enum/httpStatusCodes';

const prisma = new PrismaClient();

interface User {
  name: string
  password: string
  email: string
}

interface UserLogin {
  password: string
  email: string
}

export const loginUser = async (dto: UserLogin) => {
  const { email, password } = dto;

  const user = await prisma.users.findUnique({ where: { email } });

  if (! user) {
    throw new AppError({
      description: 'Email or password invalid',
      httpCode: HttpCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const same_password = await compare(password, user.password);

  if (! same_password) {
    throw new AppError({
      description: 'Email or password invalid',
      httpCode: HttpCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const token = sign({
    id: user.id,
    email: user.email,
  }, process.env.JWT_SECRET || '', {
    expiresIn: 86400
  });

  return { token };
};

export const createUser = async (dto: User) => {
  try {
    const { name, email, password } = dto;
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password
      }
    });

    return user;
  } catch (err) {
    throw err;
  }
}