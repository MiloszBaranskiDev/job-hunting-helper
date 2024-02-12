import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  CurrencyService,
  OffersFacade,
} from '@jhh/jhh-client/dashboard/offers/data-access';

import { OfferSalaryCurrency } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-offers-currency',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatOptionModule, MatSelectModule],
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  loadExchangeRatesSuccess$: Observable<boolean>;
  currentCurrency$: BehaviorSubject<OfferSalaryCurrency | null>;

  readonly currencyValues: string[] = Object.values(OfferSalaryCurrency);

  ngOnInit(): void {
    this.loadExchangeRatesSuccess$ =
      this.offersFacade.loadExchangeRatesSuccess$;
    this.currentCurrency$ = this.currencyService.currentCurrency$;
  }

  handleCurrencyChange(currency: string): void {
    this.currencyService.updateCurrency(currency);
  }
}
