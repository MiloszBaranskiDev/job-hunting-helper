import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Quiz } from '@jhh/shared/interfaces';
import {
  AddQuizPayload,
  AddQuizSuccessPayload,
  RemoveQuizPayload,
  RemoveQuizSuccessPayload,
} from '@jhh/jhh-client/dashboard/practice/domain';

export enum Type {
  SetPracticeQuizzes = '[Practice] Set Practice Quizzes',
  AddQuiz = '[Practice] Add Quiz',
  AddQuizFail = '[Practice] Add Quiz Fail',
  AddQuizSuccess = '[Practice] Add Quiz Success',
  ResetAddQuizSuccess = '[Practice] Reset Add Quiz Success',
  RemoveQuiz = '[Practice] Remove Quiz',
  RemoveQuizFail = '[Practice] Remove Quiz Fail',
  RemoveQuizSuccess = '[Practice] Remove Quiz Success',
  ResetRemoveQuizSuccess = '[Practice] Reset Remove Quiz Success',
}

export const setPracticeQuizzes = createAction(
  Type.SetPracticeQuizzes,
  props<{ quizzes: Quiz[] }>()
);

export const addQuiz = createAction(
  Type.AddQuiz,
  props<{ payload: AddQuizPayload }>()
);

export const addQuizFail = createAction(
  Type.AddQuizFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addQuizSuccess = createAction(
  Type.AddQuizSuccess,
  props<{ payload: AddQuizSuccessPayload }>()
);

export const resetAddQuizSuccess = createAction(Type.ResetAddQuizSuccess);

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