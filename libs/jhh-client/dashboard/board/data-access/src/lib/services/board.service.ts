import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/enums';
import {
  RemoveBoardColumnPayload,
  RemoveBoardColumnSuccessPayload,
  RemoveBoardColumnSuccessResponse,
} from '@jhh/jhh-client/dashboard/board/domain';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

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
