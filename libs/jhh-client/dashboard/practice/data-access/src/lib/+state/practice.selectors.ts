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
