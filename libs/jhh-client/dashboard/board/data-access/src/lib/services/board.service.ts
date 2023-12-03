import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/enums';
import {
  AddBoardColumnPayload,
  AddBoardColumnSuccessPayload,
  AddBoardColumnSuccessResponse,
  DuplicateBoardColumnPayload,
  DuplicateBoardColumnSuccessPayload,
  DuplicateBoardColumnSuccessResponse,
  EditBoardColumnPayload,
  EditBoardColumnSuccessPayload,
  EditBoardColumnSuccessResponse,
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

  addBoardColumn(
    payload: AddBoardColumnPayload
  ): Observable<AddBoardColumnSuccessPayload> {
    return this.http
      .post<AddBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddBoardColumn,
        {
          name: payload.name,
          color: payload.color,
        }
      )
      .pipe(map((res: AddBoardColumnSuccessResponse) => res.data));
  }

  editBoardColumn(
    payload: EditBoardColumnPayload
  ): Observable<EditBoardColumnSuccessPayload> {
    return this.http
      .patch<EditBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditBoardColumn,
        {
          columnId: payload.columnId,
          name: payload.name,
          color: payload.color,
        }
      )
      .pipe(map((res: EditBoardColumnSuccessResponse) => res.data));
  }

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
