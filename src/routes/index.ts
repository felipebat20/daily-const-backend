import * as express from 'express';
import { Application } from 'express';

import { errorHandler } from '@exceptions/ErrorHandler';

const auth = require('./AuthRoute');
const user = require('./UserRoute');
const task = require('./TaskRoute');

export default (app : Application) => {
  app.use(
    express.json(),
    auth,
    user,
    task,
  )
}