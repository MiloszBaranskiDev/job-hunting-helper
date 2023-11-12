import { TestBed } from '@angular/core/testing';

import { EditNotesGroupDialogService } from './edit-notes-group-dialog.service';

describe('EditNotesGroupDialogService', () => {
  let service: EditNotesGroupDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditNotesGroupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
