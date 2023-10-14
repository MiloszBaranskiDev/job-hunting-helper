import { TestBed } from '@angular/core/testing';

import { EditNoteModalService } from './edit-note-modal.service';

describe('EditNoteModalService', () => {
  let service: EditNoteModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditNoteModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
