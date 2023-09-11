import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';

import routes from './routes';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.APP_PORT || 8000;

routes(app);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});