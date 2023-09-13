import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AuthService } from './auth.service';

import { ApiRoutes } from '@jhh/shared/enums';

import { environment } from '@jhh/jhh-client/shared/config';

import {
  LoginPayload,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessResponse,
} from '@jhh/jhh-client/auth/interfaces';

import { User } from '@jhh/shared/interfaces';

const dummyUser: User = {
  id: '1337',
  createdAt: new Date(),
  username: 'john',
};

const TOKEN: string = 'some-token';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return a LoginSuccessPayload containing a token and user details when called with a valid LoginPayload', () => {
      const dummyPayload: LoginPayload = {
        username: dummyUser.username,
        password: 'password',
      };
      const dummyResponse: LoginSuccessResponse = {
        data: {
          token: TOKEN,
          user: dummyUser,
        },
      };

      service.login(dummyPayload).subscribe((res) => {
        expect(res).toEqual(dummyResponse.data);
      });

      const req: TestRequest = httpMock.expectOne(
        `${environment.apiUrl}${ApiRoutes.BaseUser}${ApiRoutes.Login}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(dummyResponse);
    });
  });

  describe('register', () => {
    it('should return a RegisterSuccessPayload containing a token and user details when called with a valid RegisterPayload', () => {
      const dummyPayload: RegisterPayload = {
        username: dummyUser.username,
        password: 'password',
        confirmPassword: 'password',
      };
      const dummyResponse: RegisterSuccessResponse = {
        data: {
          token: TOKEN,
          user: dummyUser,
        },
      };

      service.register(dummyPayload).subscribe((res) => {
        expect(res).toEqual(dummyResponse.data);
      });

      const req: TestRequest = httpMock.expectOne(
        `${environment.apiUrl}${ApiRoutes.BaseUser}${ApiRoutes.Register}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(dummyResponse);
    });
  });

  describe('Token Management', () => {
    it('should save token', () => {
      service.saveToken(TOKEN);
      expect(
        JSON.parse(localStorage.getItem(service.LOCALSTORAGE_KEY) as string)
      ).toBe(TOKEN);
    });

    it('should get token', () => {
      localStorage.setItem(service.LOCALSTORAGE_KEY, JSON.stringify(TOKEN));
      expect(service.getToken()).toBe(TOKEN);
    });

    it('should remove token', () => {
      localStorage.setItem(service.LOCALSTORAGE_KEY, JSON.stringify(TOKEN));
      service.removeToken();
      expect(localStorage.getItem(service.LOCALSTORAGE_KEY)).toBeNull();
    });
  });
});
