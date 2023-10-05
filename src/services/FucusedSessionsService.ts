import { FocusedSessions, Tasks } from '@prisma/client';

import { HttpCode } from '../enum/httpStatusCodes';
import { AppError } from '../exceptions/AppError';

import { prisma } from '../prisma';

class FucusedSessionsService {
  async findAllUserSessions({ user_id }: { user_id: string }) {
    const sessions = await prisma.focusedSessions.findMany({ where: { task: { user_id } }, include: { task: true } });

    return sessions;
  }

  async createFocusedSession({
    user_id,
    task_id,
    time_spent,
  }: {
    user_id: string,
    task_id: string,
    time_spent: number,
  }): Promise<FocusedSessions>
  {
    await this.validateTask({ user_id, task_id });

    const data = {
      time_spent,
      task: { connect: { id: task_id } },
    };

    const session = await prisma.focusedSessions.create({
      data,
    });

    return session;
  }

  async findAllTaskFocusedSessions({ user_id, task_id }: { user_id: string, task_id: string}): Promise<FocusedSessions[]> {
    await this.validateTask({ user_id, task_id });

    const focused_sessions = await prisma.focusedSessions.findMany({ where: { task_id } });

    return focused_sessions;
  }

  async findFocusedSession(
    { user_id, focused_session_id, task_id }:
    { user_id: string, focused_session_id: string, task_id: string },
  ): Promise<FocusedSessions|null>
  {
    await this.validateTask({ user_id, task_id });
    await this.validateFocusedSession({ id: focused_session_id });

    const focused_session = await prisma.focusedSessions.findUnique({ where: { id: focused_session_id } });

    return focused_session;
  }

  async updateFocusedSession(
    { user_id, focused_session_id, task_id, time_spent }:
    { user_id: string, focused_session_id: string, task_id: string, time_spent: number },
  ): Promise<FocusedSessions|null>
  {
    await this.validateTask({ user_id, task_id });
    await this.validateFocusedSession({ id: focused_session_id });

    const focused_session = await prisma.focusedSessions.update({ where: { id: focused_session_id }, data: { time_spent } });

    return focused_session;
  }

  async deleteFocusedSession(
    { user_id, focused_session_id, task_id }:
    { user_id: string, focused_session_id: string, task_id: string },
  ): Promise<FocusedSessions|null>
  {
    await this.validateTask({ user_id, task_id });
    await this.validateFocusedSession({ id: focused_session_id });

    const focused_session = await prisma.focusedSessions.delete({ where: { id: focused_session_id } });

    return focused_session;
  }

  private async validateTask({ user_id, task_id }: { user_id: string, task_id: string }): Promise<Tasks> {
    const task = await prisma.tasks.findUnique({ where: { id: task_id } });

    if (! task) {
      throw new AppError({ description: 'Task not found', httpCode: HttpCode.NOT_FOUND });
    }

    if (task.user_id !== user_id) {
      throw new AppError({ description: 'unauthorized', httpCode: HttpCode.UNAUTHORIZED });
    }

    return task;
  }

  private async validateFocusedSession({ id }: { id: string })
  {
    const session = await prisma.focusedSessions.findUnique({ where: { id } });

    if (! session) {
      throw new AppError({ description: 'Focused Session not found ', httpCode: HttpCode.NOT_FOUND });
    }

    return session;
  }
}

export { FucusedSessionsService };
