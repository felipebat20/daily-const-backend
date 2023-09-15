import * as express from 'express';
import { Application } from 'express';

import { errorHandler } from '@exceptions/ErrorHandler';

const auth = require('./AuthRoute');
const user = require('./UserRoute');

export default (app : Application) => {
  app.use(
    express.json(),
    auth,
    user,
  ).use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler.handleError(err, res);
  });
}