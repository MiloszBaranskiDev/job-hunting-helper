import { TestBed } from '@angular/core/testing';

import { EditNoteDialogService } from './edit-note-dialog.service';

describe('EditNoteDialogService', () => {
  let service: EditNoteDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditNoteDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
