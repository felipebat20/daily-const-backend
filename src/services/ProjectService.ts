import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ProjectService {
  async findAllUserProjects({ user_id } : { user_id: string }) {
    const projects = await prisma.projects.findMany({
      where: { user_id },
    });

    return projects;
  }

  async createProject({ user_id, name }: { user_id: string, name: string }) {
    const project = await prisma.projects.create({
      data: {
        name,
        user: {
          connect: { id: user_id },
        },
      },
    });

    return project;
  }
}

export { ProjectService };
