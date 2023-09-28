import express, { Application } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import { createHttpTerminator } from 'http-terminator';

import routes from './routes';
//For env File
dotenv.config();

const app: Application = express();

app.use(cors());
const port = process.env.APP_PORT || 8000;
export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({
  server,
});

routes(app);

app.listen(port);
