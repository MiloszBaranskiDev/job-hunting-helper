import '@angular/compiler';
import * as PracticeSelectors from './practice.selectors';

describe('Practice Selectors Full Suite', () => {
  const mockInitialState = {
    practice: {
      ids: ['1', '2'],
      entities: {
        '1': {
          id: '1',
          name: 'Quiz 1',
          slug: 'quiz-1',
          items: [],
        },
        '2': {
          id: '2',
          name: 'Quiz 2',
          slug: 'quiz-2',
          items: [],
        },
      },
      addQuiz: { inProgress: false, error: 'Error', success: true },
      editQuiz: { inProgress: true, error: null, success: false },
      removeQuiz: { inProgress: false, error: 'Error', success: true },
      addQuizResults: {
        inProgress: false,
        error: 'Error',
        success: true,
      },
    } as any,
  };

  describe('selectAddQuizInProgress', () => {
    it('should select the addQuiz inProgress state', () => {
      const result = PracticeSelectors.selectAddQuizInProgress.projector(
        mockInitialState.practice
      );
      expect(result).toBe(false);
    });
  });

  describe('selectAddQuizError', () => {
    it('should select the addQuiz error state', () => {
      const result = PracticeSelectors.selectAddQuizError.projector(
        mockInitialState.practice
      );
      expect(result).toBe('Error');
    });
  });

  describe('selectAddQuizSuccess', () => {
    it('should select the addQuiz success state', () => {
      const result = PracticeSelectors.selectAddQuizSuccess.projector(
        mockInitialState.practice
      );
      expect(result).toBe(true);
    });
  });

  describe('selectEditQuizInProgress', () => {
    it('should select the editQuiz inProgress state', () => {
      const result = PracticeSelectors.selectEditQuizInProgress.projector(
        mockInitialState.practice
      );
      expect(result).toBe(true);
    });
  });

  describe('selectEditQuizError', () => {
    it('should select the editQuiz error state', () => {
      const result = PracticeSelectors.selectEditQuizError.projector(
        mockInitialState.practice
      );
      expect(result).toBe(null);
    });
  });

  describe('selectEditQuizSuccess', () => {
    it('should select the editQuiz success state', () => {
      const result = PracticeSelectors.selectEditQuizSuccess.projector(
        mockInitialState.practice
      );
      expect(result).toBe(false);
    });
  });

  describe('selectRemoveQuizInProgress', () => {
    it('should select the removeQuiz inProgress state', () => {
      const result = PracticeSelectors.selectRemoveQuizInProgress.projector(
        mockInitialState.practice
      );
      expect(result).toBe(false);
    });
  });

  describe('selectRemoveQuizError', () => {
    it('should select the removeQuiz error state', () => {
      const result = PracticeSelectors.selectRemoveQuizError.projector(
        mockInitialState.practice
      );
      expect(result).toBe('Error');
    });
  });

  describe('selectRemoveQuizSuccess', () => {
    it('should select the removeQuiz success state', () => {
      const result = PracticeSelectors.selectRemoveQuizSuccess.projector(
        mockInitialState.practice
      );
      expect(result).toBe(true);
    });
  });

  describe('selectAddQuizResultsInProgress', () => {
    it('should select the addQuizResults inProgress state', () => {
      const result = PracticeSelectors.selectAddQuizResultsInProgress.projector(
        mockInitialState.practice
      );
      expect(result).toBe(false);
    });
  });

  describe('selectAddQuizResultsError', () => {
    it('should select the addQuizResults error state', () => {
      const result = PracticeSelectors.selectAddQuizResultsError.projector(
        mockInitialState.practice
      );
      expect(result).toBe('Error');
    });
  });

  describe('selectAddQuizResultsSuccess', () => {
    it('should select the addQuizResults success state', () => {
      const result = PracticeSelectors.selectAddQuizResultsSuccess.projector(
        mockInitialState.practice
      );
      expect(result).toBe(true);
    });
  });
});
