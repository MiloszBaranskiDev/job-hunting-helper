import { JhhServerMiddlewareAuth } from './jhh-server-middleware-auth';

describe('jhhServerMiddlewareAuth', () => {
  it('should work', () => {
    expect(JhhServerMiddlewareAuth()).toEqual('jhh-server-middleware-auth');
  });
});
