import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

interface User {
  name: string
  password: string
  email: string
}

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