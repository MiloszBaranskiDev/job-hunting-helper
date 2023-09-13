import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AuthPublicFacade } from './auth-public.facade';
import { AuthFeatureFacade } from '@jhh/jhh-client/auth/feature';

const mockAuthFeatureFacade = {
  loginOrRedirect: jest.fn(),
};

describe('AuthPublicFacade', () => {
  let authPublicFacade: AuthPublicFacade;
  let authFeatureFacade: AuthFeatureFacade;

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
        { provide: AuthFeatureFacade, useValue: mockAuthFeatureFacade },
      ],
    });

    authPublicFacade = TestBed.inject(AuthPublicFacade);
    authFeatureFacade = TestBed.inject(AuthFeatureFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(authFeatureFacade).toBeTruthy();
  });

  describe('loginOrRedirect', () => {
    it('should call loginOrRedirect on AuthFeatureFacade', () => {
      authPublicFacade.loginOrRedirect();

      expect(authFeatureFacade.loginOrRedirect).toHaveBeenCalled();
    });
  });
});
