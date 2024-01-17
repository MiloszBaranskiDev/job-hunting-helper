import { createAction, props } from '@ngrx/store';

import { Quiz } from '@jhh/shared/interfaces';

export enum Type {
  SetPracticeQuizzes = '[Practice] Set Practice Quizzes',
}

export const setPracticeQuizzes = createAction(
  Type.SetPracticeQuizzes,
  props<{ quizzes: Quiz[] }>()
);
