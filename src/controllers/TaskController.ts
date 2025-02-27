import { Request, Response } from 'express';

import { HttpCode } from '../enum/httpStatusCodes';

import { AppError } from '../exceptions/AppError';
import { errorHandler } from '../exceptions/ErrorHandler';

import { createTask, deleteTask, findAllUserTasks, findTask, initSession, stopSession, updateTask } from '../services/TaskService';
import { Task } from '../models/Task';

export class TaskController {
  static async index(req: Request, res: Response) {
    try {
      const { user: { id = '' } = {} } = req;
      const { description = '' } = req.query;

      const tasks = await findAllUserTasks({
        user_id: id as string,
        description: description as string,
      });

      return res.status(HttpCode.OK).send(await Task.collection(tasks));
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  static async show(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;
    const { id: task_id } = req.params;

    try {
      const task = await findTask({
        user_id: id as string,
        task_id,
      });

      return res.status(HttpCode.OK).send(await new Task(task));
    } catch(err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  static async inProgress(req: Request, res: Response) {
    try {
      const { id: task_id } = req.params;
      const { startAt } = req.body;

      const task = await initSession({
        task_id,
        startAt,
      });

      return res.status(HttpCode.OK).send(await new Task(task));
    } catch(err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  static async stopWatch(req: Request, res: Response) {
    try {
      const { id: task_id } = req.params;
      const { endAt } = req.body;

      const task = await stopSession({
        task_id,
        endAt,
      });

      return res.status(HttpCode.OK).send(await new Task(task));
    } catch(err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    const { user: { id = '' } = {} } = req;
    const { id: task_id } = req.params;
    const { description, project_id } = req.body;
    try {
      const task = await updateTask({
        user_id: id as string,
        task_id,
        description,
        project_id,
      });

      return res.status(HttpCode.OK).send(await new Task(task));
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
    const { description, project_id } = req.body;

    const task = await createTask({
      user_id: id as string,
      description,
      project_id,
    });

    return res.status(HttpCode.CREATED).send(await new Task(task));
  }
}
