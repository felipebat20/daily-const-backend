import { Request, Response } from 'express';

import { ProjectService } from '@services/ProjectService';

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

    const project = await projectService.createProject({ user_id, name });

    return res.status(201).send(project);
  }
}

export { ProjectController };
