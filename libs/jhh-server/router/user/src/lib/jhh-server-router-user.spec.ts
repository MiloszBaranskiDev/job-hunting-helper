import request from 'supertest';
import express, { Express, Router } from 'express';

import { ApiRoutes, HttpStatusCode } from '@jhh/shared/enums';

import { JhhServerRouterUser } from './jhh-server-router-user';

jest.mock('@jhh/jhh-server/controller/user', () => {
  return {
    JhhServerControllerUser: jest.fn().mockReturnValue({
      login: jest.fn((req, res) => res.status(200).send('Login successful')),
      register: jest.fn((req, res) =>
        res.status(HttpStatusCode.OK).send('Registration successful')
      ),
    }),
  };
});

describe('JhhServerRouterUser function', () => {
  let router: Router;

  beforeAll(() => {
    router = JhhServerRouterUser();
  });

  it('should handle POST request for login', async () => {
    const app: Express = express();
    app.use(router);

    const response = await request(app).post(ApiRoutes.Login);
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.text).toBe('Login successful');
  });

  it('should handle POST request for register', async () => {
    const app: Express = express();
    app.use(router);

    const response = await request(app).post(ApiRoutes.Register);
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.text).toBe('Registration successful');
  });
});
