import express, { Express, Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { JhhServerRouter } from '@jhh/jhh-server/router';

export function JhhServerApp(): Express {
  const app: Express = express();
  const router: Router = JhhServerRouter();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // todo: protect api route
  app.use('/api', router);

  // handle uncaught errors
  app.use((err, req, res, next) => {
    console.log(err);
    res.json({ message: `had an error: ${err.message}` });
  });

  return app;
}
