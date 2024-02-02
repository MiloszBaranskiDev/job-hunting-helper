import request from 'supertest';

import { JhhServerApp } from './jhh-server-app';

import { ApiRoute } from '@jhh/shared/domain';

describe('JhhServerApp', () => {
  let app;

  beforeEach(() => {
    app = JhhServerApp();
  });

  it('should work', () => {
    expect(typeof app.listen).toBe('function');
  });

  it('should enable CORS', async () => {
    const res = await request(app).get(`${ApiRoute.BaseUser}/some-route`);
    expect(res.headers['access-control-allow-origin']).toEqual('*');
  });
});
