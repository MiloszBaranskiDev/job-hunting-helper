import { TestBed } from '@angular/core/testing';

import { ChangeNoteGroupModalService } from './change-note-group-modal.service';

describe('ChangeNoteGroupModalService', () => {
  let service: ChangeNoteGroupModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeNoteGroupModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
