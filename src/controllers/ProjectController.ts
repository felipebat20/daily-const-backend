import { Request, Response } from 'express';

import { ProjectService } from '@services/ProjectService';
import { AppError } from '@exceptions/AppError';

const projectService = new ProjectService();

class ProjectController {
  async index(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {} } = req;

    const projects = await projectService.findAllUserProjects({ user_id });

    return res.status(200).send(projects);
  }

  async store(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {} } = req;
    const { name } = req.body;

    try {
      const project = await projectService.createProject({ user_id, name });

      return res.status(201).send(project);
    } catch(err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ message: err.message });
      }

      return res.status(400).send({ message: 'bad request' });
    }
  }

  async show(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {} } = req;
    const { id: project_id } = req.params;

    try {
      const project = await projectService.findProject({ user_id, project_id });

      return res.status(200).send(project);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ err: err.message });
      }

      return res.status(500).send({ err: 'internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {} } = req;
    const { name } = req.body;
    const { id: project_id } = req.params;

    try {
      const project = await projectService.updateProject({ project_id, user_id, name });

      return res.status(200).send(project);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ err: err.message });
      }

      return res.status(500).send({ err: 'internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    const { user: { id: user_id = '' } = {} } = req;
    const { id: project_id } = req.params;

    try {
      await projectService.deleteProject({ user_id, project_id });

      return res.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.httpCode).send({ err: err.message });
      }

      return res.status(500).send({ err: 'internal server error' });
    }
  }
}

export { ProjectController };
