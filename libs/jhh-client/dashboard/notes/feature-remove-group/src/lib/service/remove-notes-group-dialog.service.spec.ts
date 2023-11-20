import { TestBed } from '@angular/core/testing';

import { RemoveNotesGroupDialogService } from './remove-notes-group-dialog.service';

describe('RemoveNotesGroupDialogService', () => {
  let service: RemoveNotesGroupDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveNotesGroupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
