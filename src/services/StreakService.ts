import { StreakProjects } from '@prisma/client';

import { HttpCode } from '../enum/httpStatusCodes';
import { AppError } from '../exceptions/AppError';

import { prisma } from '../prisma';

class StreakService {
  async findAllStreaks({ user_id }: { user_id: string }) {
    const streaks = await prisma.streaks.findMany({
      where: {
        user: { id: user_id }
      },
      include: {
        projects: true,
      },
    });

    return streaks;
  }

  async createStreak({ user_id, name }: { user_id: string, name: string }) {
    const streak = await prisma.streaks.create({
      data: { name, user: { connect: { id: user_id } } },
    });

    return streak;
  }

  async findStreak({ user_id, streak_id }: { streak_id: string, user_id: string }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    return streak;
  }

  async updateStreak({ user_id, streak_id, name }: { streak_id: string, user_id: string, name: string }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const updated_streak = await prisma.streaks.update({ data: { name }, where: { id: streak_id } });

    return updated_streak;
  }

  async deleteStreak({ user_id, streak_id }: { streak_id: string, user_id: string }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const updated_streak = await prisma.streaks.delete({ where: { id: streak_id } });

    return updated_streak;
  }


  async attachProject({ user_id, streak_id, projects }: { user_id: string, streak_id: string, projects: string[] }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    for (const project_id of projects) {
      const project = await prisma.projects.findUnique({ where: { id: project_id } });

      if (! project) {
        throw new AppError({ description: 'Project not found', httpCode: HttpCode.NOT_FOUND });
      }
    }

    const data = projects.map(project_id => ({
      streak_id,
      project_id,
    }));

    const streak_projects = await prisma.streakProjects.createMany({
      data,
      skipDuplicates: true,
    });

    return streak_projects;
  }

  async detachProject({ user_id, streak_id, projects }: { user_id: string, streak_id: string, projects: string[] }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const deleted_projects: StreakProjects[] = [];

    for (const project_id of projects) {
      const streak = await prisma.streakProjects.delete({ where: { streak_id_project_id: { project_id, streak_id } } });

      deleted_projects.push(streak);
    }

    return deleted_projects;
  }
}

export { StreakService };
