import { PrismaClient } from '@prisma/client';

import { HttpCode } from '../enum/httpStatusCodes';
import { AppError } from '../exceptions/AppError';

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

  async findProject({ user_id, project_id } : { user_id: string, project_id: string }) {
    const project = await prisma.projects.findUnique({ where: { id: project_id } });

    if (! project) {
      throw new AppError({ description: 'Project not found', httpCode: HttpCode.NOT_FOUND });
    }

    if (project.user_id !== user_id) {
      throw new AppError({ description: 'unauthorized', httpCode: HttpCode.UNAUTHORIZED });
    }

    return project;
  }

  async updateProject({
    user_id,
    project_id,
    name,
  } : {
    user_id: string,
    project_id: string,
    name: string,
  }) {
    const project = await prisma.projects.findUnique({ where: { id: project_id } });

    if (! project) {
      throw new AppError({ description: 'Project not found', httpCode: HttpCode.NOT_FOUND });
    }

    if (project.user_id !== user_id) {
      throw new AppError({ description: 'unauthorized', httpCode: HttpCode.UNAUTHORIZED });
    }

    if (project.name && project.name !== name) {
      const updated_project = await prisma.projects.update({
        where: { id: project_id },
        data: { name },
      });

      return updated_project;
    }

    return project;
  }

  async deleteProject({
    user_id,
    project_id,
  } : {
    user_id: string,
    project_id: string,
  }) {
    const project = await prisma.projects.findUnique({ where: { id: project_id } });

    if (! project) {
      throw new AppError({ description: 'Project not found', httpCode: HttpCode.NOT_FOUND });
    }

    if (project.user_id !== user_id) {
      throw new AppError({ description: 'unauthorized', httpCode: HttpCode.UNAUTHORIZED });
    }

    await prisma.projects.delete({ where: { id: project_id } });

    return project;
  }
}

export { ProjectService };
