import { HttpCode } from '@enum/httpStatusCodes';
import { AppError } from '@exceptions/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FucusedSessionsService {
  async findAllUserSessions({ user_id }: { user_id: string }) {
    const sessions = prisma.focusedSessions.findMany({ where: { task: { user_id } }, include: { task: true, project: true } });

    return sessions;
  }

  async createFocusedSession({
    user_id,
    project_id,
    task_id,
    time_spent,
  }: {
    user_id: string,
    project_id: string,
    task_id: string,
    time_spent: number,
  }) {
    const task = await prisma.tasks.findUnique({ where: { id: task_id } });

    if (! task) {
      throw new AppError({ description: 'Task not found', httpCode: HttpCode.NOT_FOUND });
    }

    if (task.user_id !== user_id) {
      throw new AppError({ description: 'unauthorized', httpCode: HttpCode.UNAUTHORIZED });
    }

    const data = {
      time_spent,
      task: { connect: { id: task_id } },
      project: {},
    };

    if (project_id) {
      data.project = { connect: { id: project_id } };
    }

    const session = prisma.focusedSessions.create({
      data,
    });

    return session;
  }
}

export { FucusedSessionsService };
