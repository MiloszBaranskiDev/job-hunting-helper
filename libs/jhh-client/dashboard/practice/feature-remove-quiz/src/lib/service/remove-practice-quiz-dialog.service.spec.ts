import { TestBed } from '@angular/core/testing';

import { RemovePracticeQuizDialogService } from './remove-practice-quiz-dialog.service';

describe('RemovePracticeQuizDialogService', () => {
  let service: RemovePracticeQuizDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemovePracticeQuizDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
