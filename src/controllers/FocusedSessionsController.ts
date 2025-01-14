import { Request, Response } from 'express';

import { FucusedSessionsService } from '../services/FucusedSessionsService';
import { AppError } from '../exceptions/AppError';

const focusedSessionsService = new FucusedSessionsService();

class FocusedSessionsController {
  async listUserFocusedSessions(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;

      const sessions = await focusedSessionsService.findAllUserSessions({ user_id });

      res.status(200).send(sessions);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      res.status(500).send({ message: 'internal error' });
    }
  }

  async listTaskFocusedSessions(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;
      const { task_id } = req.params;

      const sessions = await focusedSessionsService.findAllTaskFocusedSessions({ user_id, task_id });

      res.status(200).send(sessions);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      res.status(500).send({ message: 'internal error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;
      const { task_id, session_id: focused_session_id } = req.params;
      const { startAt, endAt } = req.body;

      const session = await focusedSessionsService.updateFocusedSession({
        user_id,
        task_id,
        focused_session_id,
        startAt,
        endAt
      });

      res.status(200).send(session);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      res.status(500).send({ message: 'internal error' });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;
      const { task_id } = req.params;

      const sessions = await focusedSessionsService.createFocusedSession({
        user_id,
        task_id,
      });

      res.status(200).send(sessions);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      res.status(500).send({ message: 'internal error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;
      const { task_id, session_id: focused_session_id } = req.params;

      await focusedSessionsService.deleteFocusedSession({ user_id, task_id, focused_session_id });

      res.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      res.status(500).send({ message: 'internal error' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;
      const { task_id, session_id: focused_session_id } = req.params;

      const session = await focusedSessionsService.findFocusedSession({ user_id, task_id, focused_session_id });

      res.status(200).send(session);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      res.status(500).send({ message: 'internal error' });
    }
  }
}

export { FocusedSessionsController };
