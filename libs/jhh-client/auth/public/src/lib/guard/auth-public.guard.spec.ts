import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AuthPublicFacade } from '../+state/auth-public.facade';
import { AuthFeatureFacade } from '@jhh/jhh-client/auth/feature';

import { authPublicGuard } from './auth-public.guard';

const mockAuthFeatureFacade = {
  loginOrRedirect: jest.fn(),
};

describe('authPublicGuard', () => {
  let authPublicFacade: AuthPublicFacade;
  let authFeatureFacade: AuthFeatureFacade;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authPublicGuard(...guardParameters));

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthPublicFacade,
        {
          provide: AuthFeatureFacade,
          useValue: mockAuthFeatureFacade,
        },
      ],
    });

    authPublicFacade = TestBed.inject(AuthPublicFacade);
    authFeatureFacade = TestBed.inject(AuthFeatureFacade);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  describe('loginOrRedirect', () => {
    it('should call loginOrRedirect on authFeatureFacade', () => {
      authPublicFacade.loginOrRedirect();

      expect(authFeatureFacade.loginOrRedirect).toHaveBeenCalled();
    });
  });
});
