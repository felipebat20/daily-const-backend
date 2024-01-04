import { groupBy, omit, uniqBy } from 'lodash';

import { HttpCode } from '../enum/httpStatusCodes';
import { AppError } from '../exceptions/AppError';

import { prisma } from '../prisma';
import { Project } from 'src/interfaces/IProject';

enum Descendancy {
  ASC = 'asc',
  DESC = 'desc'
}

interface Sorts {
  [key: string]: [value: Descendancy]
}

class StreakService {
  async findAllStreaks({ user_id, sorts }: { user_id: string, sorts: Sorts }) {
    const streaks = await prisma.streaks.findMany({
      where: { user: { id: user_id } },
      include: { projects: true },
      orderBy: { ...sorts },
    });



    return streaks;
  }

  async getOfensiveFromStreak(streak: any) {
    const project_ids = streak.projects.map((project: Project) => project.id);
    const focused_sessions = await prisma.focusedSessions.findMany({
      where: {
        task: {
          project_id: {
            in: project_ids,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { task: { include: { project: true } } },
    });

    const most_recent_session = focused_sessions[0].createdAt;
    const parsed_date = new Date(
      Date.UTC(
        most_recent_session.getFullYear(),
        most_recent_session.getMonth(),
        most_recent_session.getDate()
      ),
    );


    const today_date = new Date();

    const yesterday = new Date(
      Date.UTC(
        today_date.getFullYear(),
        today_date.getMonth(),
        today_date.getDate() - 1,
      ),
    );

    if (parsed_date < yesterday) {
      return { ofensive: 0 };
    }
    console.log(parsed_date);
  }

  async createStreak({ user_id, name, projects }: { user_id: string, name: string, projects: string[] }) {
    const data = projects.map(project_id => ({ id: project_id }));

    const streak = await prisma.streaks.create({
      data: {
        name,
        user: { connect: { id: user_id } },
        projects: { connect: data },
      },
      include: { projects: true },
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

    this.getOfensiveFromStreak(streak);

    return streak;
  }

  async updateStreak({ user_id, streak_id, name, projects }: { streak_id: string, user_id: string, name: string, projects: undefined | string[] }) {
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

    if (projects) {
      const disconnected_projects = streak.projects.map(project => project.id).filter(project_id => ! projects.includes(project_id));
      const projects_to_connect = projects.filter(proj => {
        const streak_projects = streak.projects.map(project => project.id);

        return ! streak_projects.includes(proj);
      });

      if (disconnected_projects.length) {
        await prisma.streaks.update({
          where: { id: streak_id },
          data: {
            projects: {
              disconnect: disconnected_projects.map(project_id => ({ id: project_id })),
            },
          },
        });
      }

      if (projects_to_connect.length) {
        await prisma.streaks.update({
          where: { id: streak_id },
          data: {
            projects: {
              connect: projects_to_connect.map(project_id => ({ id: project_id })),
            },
          },
        });
      }
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

  async focusSummaries({ user_id, streak_id }: { user_id: string, streak_id: string }) {
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

    const projects_ids = streak.projects.map(project => ({ id: project.id }));

    const focused_sessions = await prisma.focusedSessions.findMany({
      where: {
        task: {
          project_id: {
            in: projects_ids.map(project => project.id)
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { task: { include: { project: true } } },
    });

    const agg_sessions = groupBy(focused_sessions, (session) => {
      const created_date = session.createdAt;

      return `${created_date.getFullYear()}-${created_date.getMonth()}-${created_date.getDate()}`;
    });

    const parsed_data = Object.entries(agg_sessions).map(([key, value]) => {
      return {
        date: key,
        totalFocusTime: value.map(focused => focused.time_spent).reduce((total, current_value) => current_value + total, 0),
        totalFocusedSessions: value.length,
        totalTasks: uniqBy(value.map(focused => omit(focused.task, 'project')), 'id').length,
        totalProjects: uniqBy(value.map(focused => focused.task.project), 'id').length,
        tasks: uniqBy(value.map(focused => omit(focused.task, 'project')), 'id'),
        projects: uniqBy(value.map(focused => focused.task.project), 'id'),
      };
    });

    return parsed_data;
  }
}

export { StreakService };
