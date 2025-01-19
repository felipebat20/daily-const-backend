import { groupBy, omit, uniqBy } from 'lodash';
import { isTomorrow } from 'date-fns';

import { HttpCode } from '../enum/httpStatusCodes';
import { AppError } from '../exceptions/AppError';

import { prisma } from '../prisma';

import { Project } from '../interfaces/IProject';

enum Descendancy {
  ASC = 'asc',
  DESC = 'desc'
}

interface Sorts {
  [key: string]: [value: Descendancy]
}

class StreakService {
  private getTimeSpent(focused) {
    return Math.abs(focused.startAt - (focused.endAt  || new Date())) / 1000;
  }

  async findAllStreaks({ user_id, sorts }: { user_id: string, sorts: Sorts }) {
    const streaks = await prisma.streaks.findMany({
      where: { user: { id: user_id } },
      include: { projects: true },
      orderBy: { ...sorts },
    });

    const new_streaks: any[] = [];

    for (const streak of streaks) {
      const offensive = await this.getOffensiveFromStreak(streak);

      new_streaks.push({ ...streak, offensive });
    }

    return new_streaks;
  }

  getDateWithoutTimezoneOffset(current_date: Date) {
    const date = new Date();
    const user_timezone_offset = 180;

    return new Date(
      current_date.getFullYear(),
      current_date.getMonth(),
      current_date.getDate(),
      current_date.getHours(),
      current_date.getMinutes() - (user_timezone_offset - date.getTimezoneOffset()),
      current_date.getSeconds(),
    );
  }

  async getOffensiveFromStreak(streak: any) {
    const project_ids = streak.projects.map((project: Project) => project.id);
    const focused_sessions = await prisma.focusedSessions.findMany({
      where: {
        task: {
          project_id: {
            in: project_ids,
          }
        },
      },
      orderBy: { createdAt: 'asc' },
      include: { task: { include: { project: true } } },
    });

    if (focused_sessions.length) {
      const today_date = new Date();
      const most_recent_session = focused_sessions[focused_sessions.length - 1].createdAt;

      const today_parsed_date = `${today_date.getFullYear()}${today_date.getMonth()}${today_date.getDate()}`;
      const most_recent_parsed_session = `${most_recent_session.getFullYear()}${most_recent_session.getMonth()}${most_recent_session.getDate()}`;

      const today_is_in_streak = today_parsed_date === most_recent_parsed_session;

      const agg_sessions = groupBy(focused_sessions, ({ createdAt }) => {
        const date = new Date();
        //TODO: get user timezone
        const user_timezone_offset = 180;
        const created_date =  new Date(
          createdAt.getFullYear(),
          createdAt.getMonth(),
          createdAt.getDate(),
          createdAt.getHours(),
          createdAt.getMinutes() - (user_timezone_offset - date.getTimezoneOffset()),
          createdAt.getSeconds(),
        );

        return `${created_date.getFullYear()}-${created_date.getMonth()}-${created_date.getDate()}`;
      });

      let offensive = 0;

      Object.entries(agg_sessions).forEach(([key, value], index) => {
        const next_created_date = new Date(
          Date.UTC(
            parseInt(key.split('-')[0]),
            parseInt(key.split('-')[1]),
            parseInt(key.split('-')[2]) + 1,
            0,
            0
          ),
        );

        const next_date_in_loop = !! Object.keys(agg_sessions).find(date_str => {
          return date_str === `${next_created_date.getFullYear()}-${next_created_date.getMonth()}-${next_created_date.getDate()}`;
        });

        if (next_date_in_loop || isTomorrow(next_created_date)) {
          offensive = offensive + 1;

          return;
        }

        offensive = 0;
      });

      return { days: offensive, today_is_in_streak };
    }

    return { days: 0, today_is_in_streak: false };
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

    return { ...streak, offensive: this.getOffensiveFromStreak(streak) };
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

    return { ...streak, offensive: this.getOffensiveFromStreak(streak) };
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

    return { ...updated_streak, offensive: this.getOffensiveFromStreak(streak) };
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

    const agg_sessions = groupBy(focused_sessions, ({ createdAt }) => {
      const date = new Date();
      const user_timezone_offset = 180;
      const created_date =  new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDate(),
        createdAt.getHours(),
        createdAt.getMinutes() - (user_timezone_offset - date.getTimezoneOffset()),
        createdAt.getSeconds(),
      );

      return `${created_date.getFullYear()}-${created_date.getMonth()}-${created_date.getDate()}`;
    });


    const parsed_data = Object.entries(agg_sessions).map(([key, value]) => {
      return {
        date: key,
        totalFocusTime: value.map(focused => this.getTimeSpent(focused)).reduce((total, current_value) => current_value + total, 0),
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
