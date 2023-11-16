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
    const streak = await prisma.streaks.findUnique({
      where: {
        id: streak_id,
        user: { id: user_id }
      },
      include: { projects: true },
    });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    return streak;
  }

  async updateStreak({ user_id, streak_id, name }: { streak_id: string, user_id: string, name: string }) {
    const streak = await prisma.streaks.findUnique({
      where: {
        id: streak_id,
        user: { id: user_id }
      },
    });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const updated_streak = await prisma.streaks.update({
      data: { name },
      where: { id: streak_id },
      include: { projects: true },
    });

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
      id: project_id,
    }));

    const streak_projects = await prisma.streaks.update({
      where: {
        id: streak_id,
      },
      data: {
        projects: { connect: data },
      },
      include: {
        projects: true,
      },
    });

    return streak_projects;
  }

  async detachProject({ user_id, streak_id, projects }: { user_id: string, streak_id: string, projects: string[] }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const projects_data = projects.map(project_id => ({ id: project_id }));

    const streak_data = await prisma.streaks.update({
      where: { id: streak_id },
      data: {
        projects: {
          disconnect: projects_data,
        },
      },
      include: { projects: true },
    });

    return streak_data;
  }
}

export { StreakService };
