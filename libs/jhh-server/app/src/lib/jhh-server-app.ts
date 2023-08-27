import express, { Express, Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApiRoutes } from '@jhh/shared/enums';
import { JhhServerRouterApi } from '@jhh/jhh-server/router/api';
import { JhhServerRouterUser } from '@jhh/jhh-server/router/user';
import { JhhServerMiddlewareAuth } from '@jhh/jhh-server/middleware/auth';

export function JhhServerApp(): Express {
  const app: Express = express();

  const apiRouter: Router = JhhServerRouterApi();
  const userRouter: Router = JhhServerRouterUser();

  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(ApiRoutes.BaseProtected, JhhServerMiddlewareAuth, apiRouter);

  app.use(ApiRoutes.BaseUser, userRouter);

  // handle uncaught errors
  app.use((err, req, res, next) => {
    console.log(err);
    res.json({ message: `had an error: ${err.message}` });
  });

  return app;
}
