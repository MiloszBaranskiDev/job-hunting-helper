import { TestBed } from '@angular/core/testing';

import { RemoveNoteDialogService } from '../../feature/service/remove-note-dialog.service';

describe('RemoveNoteDialogService', () => {
  let service: RemoveNoteDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveNoteDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
