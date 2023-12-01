import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/enums';
import {
  DuplicateBoardColumnPayload,
  DuplicateBoardColumnSuccessPayload,
  RemoveBoardColumnPayload,
  RemoveBoardColumnSuccessPayload,
  RemoveBoardColumnSuccessResponse,
} from '@jhh/jhh-client/dashboard/board/domain';
import { DuplicateBoardColumnSuccessResponse } from 'libs/jhh-client/dashboard/board/domain/src/lib/interfaces/responses/duplicate-board-column-success-response';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  duplicateBoardColumn(
    payload: DuplicateBoardColumnPayload
  ): Observable<DuplicateBoardColumnSuccessPayload> {
    return this.http
      .post<DuplicateBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.DuplicateBoardColumn,
        {
          columnId: payload.columnId,
        }
      )
      .pipe(map((res: DuplicateBoardColumnSuccessResponse) => res.data));
  }

  removeBoardColumn(
    payload: RemoveBoardColumnPayload
  ): Observable<RemoveBoardColumnSuccessPayload> {
    return this.http
      .delete<RemoveBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveBoardColumn,
        {
          params: { columnId: payload.columnId },
        }
      )
      .pipe(map((res: RemoveBoardColumnSuccessResponse) => res.data));
  }
}
