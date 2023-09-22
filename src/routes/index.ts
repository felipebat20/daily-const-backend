import * as express from 'express';
import { Application } from 'express';

import auth from'./Auth.route';
import user from'./User.route';
import task from'./Task.route';
import project from'./Project.route';
import focused_sessions from'./FocusedSessions.route';

export default (app : Application) => {
  app.use(
    express.json(),
    auth,
    user,
    task,
    project,
    focused_sessions,
  );
};
