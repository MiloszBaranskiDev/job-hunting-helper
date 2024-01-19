import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as PracticeActions from './practice.actions';

import { Quiz } from '@jhh/shared/interfaces';

export const PRACTICE_STATE_KEY = 'practice';

export interface OperationState {
  inProgress: boolean;
  error: string | null;
  success?: boolean;
}

export interface PracticeState extends EntityState<Quiz> {
  removeQuiz: OperationState;
}

export const adapter: EntityAdapter<Quiz> = createEntityAdapter<Quiz>();

export const initialPracticeState: PracticeState = adapter.getInitialState({
  removeQuiz: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<PracticeState> = createReducer(
  initialPracticeState,
  on(PracticeActions.setPracticeQuizzes, (state, { quizzes }) =>
    adapter.setAll(quizzes, state)
  ),
  on(PracticeActions.removeQuiz, (state) => ({
    ...state,
    removeQuiz: {
      ...state.removeQuiz,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(PracticeActions.removeQuizFail, (state, { payload }) => ({
    ...state,
    removeQuiz: {
      ...state.removeQuiz,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(PracticeActions.removeQuizSuccess, (state, { payload }) => {
    return adapter.removeOne(payload.removedQuiz.id, {
      ...state,
      removeQuiz: {
        ...state.removeQuiz,
        inProgress: false,
        success: true,
      },
    });
  }),
  on(PracticeActions.resetRemoveQuizSuccess, (state) => ({
    ...state,
    removeQuiz: {
      ...state.removeQuiz,
      success: false,
    },
  }))
);

export function practiceReducer(
  state: PracticeState | undefined,
  action: Action
) {
  return reducer(state, action);
}
