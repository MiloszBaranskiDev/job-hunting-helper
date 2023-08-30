import { TestBed } from '@angular/core/testing';

import { ActionResolverService } from './action-resolver.service';

describe('ActionResolverServiceService', () => {
  let service: ActionResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
