import { TestBed } from '@angular/core/testing';

import { ModalService } from 'libs/jhh-client/dashboard/notes/remove-note/src/lib/feature/service/remove-note-modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
