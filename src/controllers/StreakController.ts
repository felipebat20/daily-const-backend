import { Request, Response } from 'express';

import { StreakService } from '../services/StreakService';
import { AppError } from '../exceptions/AppError';

const streakService = new StreakService();

class StreakController {
  async index(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;

    try {
      const streaks = await streakService.findAllStreaks({ user_id });

      return res.status(200).send(streaks);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async store(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { name } = req.body;

    try {
      const streak = await streakService.createStreak({ user_id, name });

      return res.status(201).send(streak);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async show(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { streak_id } = req.params;

    try {
      const streak = await streakService.findStreak({ user_id, streak_id });

      return res.status(201).send(streak);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }
  async update(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { streak_id } = req.params;
    const { name } = req.body;

    try {
      const streak = await streakService.updateStreak({ user_id, streak_id, name });

      return res.status(201).send(streak);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { streak_id } = req.params;

    try {
      await streakService.deleteStreak({ user_id, streak_id });

      return res.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async attach(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { projects } = req.body;
    const { streak_id } = req.params;

    try {
      const streak_project = await streakService.attachProject({ user_id, streak_id, projects });

      return res.status(200).send(streak_project);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async detach(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { projects } = req.body;
    const { streak_id } = req.params;

    try {
      const streak_project = await streakService.detachProject({ user_id, streak_id, projects });

      return res.status(200).send(streak_project);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async focus_summaries(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {}  } = req;
    const { streak_id } = req.params;

    try {
      const focused_summaries = await streakService.focusSummaries({ user_id, streak_id });

      return res.status(200).send(focused_summaries);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'internal server error' });
    }
  }
}

export { StreakController };
