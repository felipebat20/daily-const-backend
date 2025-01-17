import { HttpCode } from '../enum/httpStatusCodes';
import { AppError } from '../exceptions/AppError';

import { prisma } from '../prisma';

interface TaskDto {
  id?: string,
  description: string,
  user_id: string,
  project_id: string,
}

export const findAllUserTasks = async (dto: {
  user_id: string,
  description: string
}) => {
  const { user_id, description } = dto;

  const tasks = await prisma.tasks.findMany({
    where: {
      user_id,
      description: {
        contains: description,
        mode: 'insensitive',
      },
    },

    include: { sessions: true, project: true },
  });

  return tasks;
};

export const findTask = async (dto: { user_id: string, task_id: string }) => {
  const { user_id, task_id } = dto;

  const task = await prisma.tasks.findUnique({
    where: { user_id, id: task_id },
    include: { sessions: true, project: true },
  });

  if (! task) {
    throw new AppError({
      description: 'Task not found',
      httpCode: HttpCode.NOT_FOUND,
    });
  }

  return task;
};

export const updateTask = async (dto: { user_id: string, task_id: string, project_id: string, description: string }) => {
  const { user_id, task_id, description, project_id  } = dto;

  const task = await prisma.tasks.update({
    where: { user_id, id: task_id },
    data: { description, project_id },
    include: { sessions: true, project: true },
  });

  return task;
};

export const deleteTask = async (dto: { user_id: string, task_id: string }) => {
  const { user_id, task_id } = dto;

  const task =  await prisma.tasks.findUnique({ where: { id: task_id } });

  if (! task) {
    throw new AppError({
      description: 'Task not found',
      httpCode: HttpCode.NOT_FOUND,
    });
  }

  if (task.user_id !== user_id) {
    throw new AppError({
      description: 'unauthorized',
      httpCode: HttpCode.UNAUTHORIZED,
    });
  }

  await prisma.tasks.delete({
    where: { user_id, id: task_id },
  });

  return task;
};

export const createTask = async (dto: TaskDto) => {
  const { user_id, description, project_id } = dto;

  const tasks = await prisma.tasks.create({
    data: {
      description,
      user_id,
      project_id,
      sessions: {
        create: [{ createdAt: new Date() }]
      }
    },
    include: { sessions: true, project: true },
  });

  return tasks;
};
