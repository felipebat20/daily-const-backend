import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAllUsers = () => {
  const users = prisma.users.findMany({
    skip: 0,
    take: 25,
  });

  return users;
}