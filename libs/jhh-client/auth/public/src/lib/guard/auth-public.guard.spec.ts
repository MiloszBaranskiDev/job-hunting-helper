import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authPublicGuard } from './auth-public.guard';

describe('authPublicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authPublicGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
