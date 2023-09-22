import { Request, Response } from 'express';

import { FucusedSessionsService } from '@services/FucusedSessionsService';

const focusedSessionsService = new FucusedSessionsService();

class FocusedSessionsController {
  async listUserFocusedSessions(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;

      const sessions = await focusedSessionsService.findAllUserSessions({ user_id });

      res.status(200).send(sessions);
    } catch (err) {
      res.status(500).send({ message: 'internal error' });
    }
  }

  async listTaskFocusedSessions(req: Request, res: Response) {
  }

  async update(req: Request, res: Response) {

  }

  async store(req: Request, res: Response) {
    try {
      const { user: { id: user_id = '' } = {} } = req;
      const { project_id, time_spent } = req.body;
      const { task_id } = req.params;

      const sessions = await focusedSessionsService.createFocusedSession({ user_id, task_id, time_spent, project_id });

      res.status(200).send(sessions);
    } catch (err) {
      res.status(500).send({ message: 'internal error' });
    }
  }

  async delete(req: Request, res: Response) {

  }

  async show(req: Request, res: Response) {

  }
}

export { FocusedSessionsController };
