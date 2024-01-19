import { createAction, props } from '@ngrx/store';

import { Quiz } from '@jhh/shared/interfaces';
import {
  RemoveQuizPayload,
  RemoveQuizSuccessPayload,
} from '@jhh/jhh-client/dashboard/practice/domain';
import { HttpErrorResponse } from '@angular/common/http';

export enum Type {
  SetPracticeQuizzes = '[Practice] Set Practice Quizzes',
  RemoveQuiz = '[Practice] Remove Quiz',
  RemoveQuizFail = '[Practice] Remove Quiz Fail',
  RemoveQuizSuccess = '[Practice] Remove Quiz Success',
  ResetRemoveQuizSuccess = '[Practice] Reset Remove Quiz Success',
}

export const setPracticeQuizzes = createAction(
  Type.SetPracticeQuizzes,
  props<{ quizzes: Quiz[] }>()
);

export const removeQuiz = createAction(
  Type.RemoveQuiz,
  props<{ payload: RemoveQuizPayload }>()
);

export const removeQuizFail = createAction(
  Type.RemoveQuizFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeQuizSuccess = createAction(
  Type.RemoveQuizSuccess,
  props<{ payload: RemoveQuizSuccessPayload }>()
);

export const resetRemoveQuizSuccess = createAction(Type.ResetRemoveQuizSuccess);
