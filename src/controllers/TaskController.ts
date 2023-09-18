import { Request, Response } from "express";

import { createTask, deleteTask, findAllUserTasks, findTask, updateTask } from "@services/TaskService";
import { HttpCode } from "@enum/httpStatusCodes";
import { errorHandler } from "@exceptions/ErrorHandler";
import { AppError } from "@exceptions/AppError";

export class TaskController {
  static async index(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;

    const tasks = await findAllUserTasks({ user_id: id as string });

    return res.status(HttpCode.OK).send(tasks);
  }

  static async show(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;
    const { id: task_id } = req.params;

    const tasks = await findTask({
      user_id: id as string,
      task_id,
    });

    return res.status(HttpCode.OK).send(tasks);
  }

  static async update(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;
    const { id: task_id } = req.params;
    const { description } = req.body;
    try {
      const tasks = await updateTask({
        user_id: id as string,
        task_id,
        description,
      });

      return res.status(HttpCode.OK).send(tasks);
    } catch (err) {
      if (err instanceof AppError) {
        return errorHandler.handleError(err);
      }

      res.status(HttpCode.INTERNAL_SERVER).send('Internal server error');
    }
  }

  static async delete(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;
    const { id: task_id } = req.params;

    try {
      const tasks = await deleteTask({
        user_id: id as string,
        task_id,
      });

      return res.status(HttpCode.NO_CONTENT).send(tasks);
    } catch (err) {
      if (err instanceof AppError) {
        return errorHandler.handleError(err, res);
      }

      res.status(HttpCode.INTERNAL_SERVER).send('Internal server error');
    }
  }

  static async store(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;
    const { description } = req.body;

    const task = await createTask({
      user_id: id as string,
      description,
    });

    return res.status(HttpCode.CREATED).send(task);
  }
}