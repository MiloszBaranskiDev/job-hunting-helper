import '@angular/compiler';
import { Router } from '@angular/router';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { AuthFeatureFacade } from './auth-feature.facade';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

const inject = require('@angular/core').inject;

describe('AuthFeatureFacade', () => {
  let routerMock: jest.Mocked<Router>;
  let authFacadeMock: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    authFacadeMock = {
      getToken: jest.fn(),
      saveToken: jest.fn(),
    } as unknown as jest.Mocked<AuthFacade>;

    inject.mockImplementation((token: any) => {
      if (token === Router) {
        return routerMock;
      } else if (token === AuthFacade) {
        return authFacadeMock;
      }
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login when token exists', () => {
    const mockToken = 'some-token';
    authFacadeMock.getToken.mockReturnValue(mockToken);

    const authFeatureFacade = new AuthFeatureFacade();
    authFeatureFacade.loginOrRedirect();

    expect(authFacadeMock.getToken).toBeCalled();
    expect(authFacadeMock.saveToken).toBeCalledWith(mockToken);
    expect(routerMock.navigate).not.toBeCalled();
  });

  it('should redirect to login when token does not exist', () => {
    authFacadeMock.getToken.mockReturnValue(null as any);

    const authFeatureFacade = new AuthFeatureFacade();
    authFeatureFacade.loginOrRedirect();

    expect(authFacadeMock.getToken).toBeCalled();
    expect(authFacadeMock.saveToken).not.toBeCalled();
    expect(routerMock.navigate).toBeCalledWith([ClientRoute.LoginLink]);
  });
});
