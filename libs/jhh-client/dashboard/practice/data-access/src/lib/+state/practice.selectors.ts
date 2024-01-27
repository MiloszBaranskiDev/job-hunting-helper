import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter, PRACTICE_STATE_KEY, PracticeState } from './practice.reducer';

import { Quiz } from '@jhh/shared/interfaces';

export const selectPracticeState =
  createFeatureSelector<PracticeState>(PRACTICE_STATE_KEY);

export const {
  selectIds: selectQuizzesIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllQuizzes,
  selectTotal: selectTotalQuizzes,
} = adapter.getSelectors(selectPracticeState);

export const selectQuizzes = createSelector(
  selectAllQuizzes,
  (quizzes: Quiz[]) => quizzes
);

export const selectQuizBySlug = createSelector(
  selectAllQuizzes,
  (quizzes: Quiz[], slug: string) => quizzes.find((quiz) => quiz.slug === slug)
);

export const selectAddQuizInProgress = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.addQuiz.inProgress
);

export const selectAddQuizError = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.addQuiz.error
);

export const selectAddQuizSuccess = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.addQuiz.success!
);

export const selectRemoveQuizInProgress = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.removeQuiz.inProgress
);

export const selectRemoveQuizError = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.removeQuiz.error
);

export const selectRemoveQuizSuccess = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.removeQuiz.success!
);

export const selectAddQuizResultsInProgress = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.addQuizResults.inProgress
);

export const selectAddQuizResultsError = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.addQuizResults.error
);

export const selectAddQuizResultsSuccess = createSelector(
  selectPracticeState,
  (state: PracticeState) => state.addQuizResults.success!
);

export const selectSearchQuizzes = createSelector(
  selectAllQuizzes,
  (quizzes: Quiz[], props: { query: string }) => {
    if (!props.query) {
      return null;
    }
    if (quizzes.length > 0) {
      return quizzes.filter((quiz) =>
        quiz.name.toLowerCase().includes(props.query.toLowerCase())
      );
    } else {
      return [];
    }
  }
);
