import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/enums';
import {
  RemoveOfferPayload,
  RemoveOfferSuccessPayload,
  RemoveOfferSuccessResponse,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  removeOffer(
    payload: RemoveOfferPayload
  ): Observable<RemoveOfferSuccessPayload> {
    return this.http
      .delete<RemoveOfferSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveOffer,
        {
          params: { offerId: payload.offerId },
        }
      )
      .pipe(map((res: RemoveOfferSuccessResponse) => res.data));
  }
}
