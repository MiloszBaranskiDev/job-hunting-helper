import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LocalStorageKeys, OfferSalaryCurrency } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currentCurrency$: BehaviorSubject<OfferSalaryCurrency | null> =
    new BehaviorSubject<OfferSalaryCurrency | null>(this.getStoredCurrency());

  updateCurrency(currency: string): void {
    if (this.isValidCurrency(currency)) {
      this.currentCurrency$.next(currency);
    } else {
      this.currentCurrency$.next(null);
    }

    localStorage.setItem(LocalStorageKeys.Currency, currency);
  }

  private getStoredCurrency(): OfferSalaryCurrency | null {
    const currency: string | null = localStorage.getItem(
      LocalStorageKeys.Currency
    );

    return this.isValidCurrency(currency)
      ? (currency as OfferSalaryCurrency)
      : null;
  }

  private isValidCurrency(currency: any): currency is OfferSalaryCurrency {
    return Object.values(OfferSalaryCurrency).includes(currency);
  }
}
