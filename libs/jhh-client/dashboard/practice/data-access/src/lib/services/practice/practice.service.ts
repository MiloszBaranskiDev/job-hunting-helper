import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/enums';
import {
  RemoveQuizPayload,
  RemoveQuizSuccessPayload,
  RemoveQuizSuccessResponse,
} from '@jhh/jhh-client/dashboard/practice/domain';

@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  removeQuiz(payload: RemoveQuizPayload): Observable<RemoveQuizSuccessPayload> {
    return this.http
      .delete<RemoveQuizSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemovePracticeQuiz,
        {
          params: { quizId: payload.quizId },
        }
      )
      .pipe(map((res: RemoveQuizSuccessResponse) => res.data));
  }
}
