import * as express from 'express';
import { Application } from 'express';

const auth = require('./AuthRoute');
const user = require('./UserRoute');

export default (app : Application) => {
  app.use(
    express.json(),
    auth,
    user,
  )
}