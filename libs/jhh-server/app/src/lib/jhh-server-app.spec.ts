import request from 'supertest';

import { JhhServerApp } from './jhh-server-app';

import { ApiRoutes } from '@jhh/shared/enums';

describe('JhhServerApp', () => {
  let app;

  beforeEach(() => {
    app = JhhServerApp();
  });

  it('should work', () => {
    expect(typeof app.listen).toBe('function');
  });

  it('should enable CORS', async () => {
    const res = await request(app).get(`${ApiRoutes.BaseUser}/some-route`);
    expect(res.headers['access-control-allow-origin']).toEqual('*');
  });
});
