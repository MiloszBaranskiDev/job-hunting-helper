import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter, PRACTICE_STATE_KEY, PracticeState } from './practice.reducer';

import { Quiz } from '@jhh/shared/interfaces';

export const selectPracticeState =
  createFeatureSelector<PracticeState>(PRACTICE_STATE_KEY);

export const {
  selectIds: selectEventsIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllQuizzes,
  selectTotal: selectTotalEvents,
} = adapter.getSelectors(selectPracticeState);

export const selectQuizzes = createSelector(
  selectAllQuizzes,
  (quizzes: Quiz[]) => quizzes
);
