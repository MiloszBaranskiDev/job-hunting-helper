import { TestBed } from '@angular/core/testing';

import { ChangeNoteGroupDialogService } from './change-note-group-dialog.service';

describe('ChangeNoteGroupDialogService', () => {
  let service: ChangeNoteGroupDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeNoteGroupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
