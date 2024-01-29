import { TestBed } from '@angular/core/testing';

import { EditPracticeQuizDialogService } from './edit-practice-quiz-dialog.service';

describe('EditPracticeQuizDialogService', () => {
  let service: EditPracticeQuizDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditPracticeQuizDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
