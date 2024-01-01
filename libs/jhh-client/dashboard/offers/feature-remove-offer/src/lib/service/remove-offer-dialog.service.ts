import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Offer } from '@jhh/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RemoveOfferDialogService {
  private _offerToRemove$: Subject<Offer | undefined> = new Subject<
    Offer | undefined
  >();
  offerToRemove$: Observable<Offer | undefined> =
    this._offerToRemove$.asObservable();

  openDialog(offerToRemove: Offer): void {
    this._offerToRemove$.next(offerToRemove);
  }

  clearOfferToRemove(): void {
    this._offerToRemove$.next(undefined);
  }
}
