import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ApiRoutes } from '@jhh/shared/enums';

import { environment } from '@jhh/jhh-client/shared/config';

import {
  LoadAssignedDataSuccessPayload,
  LoadAssignedDataSuccessResponse,
} from '@jhh/jhh-client/dashboard/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoutes.BaseProtected;

  loadAssignedData(): Observable<LoadAssignedDataSuccessPayload> {
    return this.http
      .get<LoadAssignedDataSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoutes.LoadAssignedData,
        {}
      )
      .pipe(map((res: LoadAssignedDataSuccessResponse) => res.data));
  }
}
