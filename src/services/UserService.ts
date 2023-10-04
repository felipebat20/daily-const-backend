import { prisma } from '../prisma';

export const findAllUsers = async () => {
  const users = await prisma.users.findMany({
    skip: 0,
    take: 25,
  });

  return users;
};
