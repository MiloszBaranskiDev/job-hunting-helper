import { TestBed } from '@angular/core/testing';

import { EditNotesGroupModalService } from './edit-notes-group-modal.service';

describe('EditNotesGroupModalService', () => {
  let service: EditNotesGroupModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditNotesGroupModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
