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
  addQuiz: OperationState;
}

export const adapter: EntityAdapter<Quiz> = createEntityAdapter<Quiz>();

export const initialPracticeState: PracticeState = adapter.getInitialState({
  addQuiz: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<PracticeState> = createReducer(
  initialPracticeState,
  on(PracticeActions.setPracticeQuizzes, (state, { quizzes }) =>
    adapter.setAll(quizzes, state)
  )
);

export function practiceReducer(
  state: PracticeState | undefined,
  action: Action
) {
  return reducer(state, action);
}
