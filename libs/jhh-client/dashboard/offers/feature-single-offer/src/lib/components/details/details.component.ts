import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, filter, first, Observable, tap } from 'rxjs';

import { FormatOfferSalaryPipe } from '@jhh/jhh-client/dashboard/offers/util-format-offer-salary';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';
import { GetOfferSalaryConversion } from '@jhh/jhh-client/dashboard/offers/util-get-offer-salary-conversion';
import {
  CurrencyService,
  OffersFacade,
} from '@jhh/jhh-client/dashboard/offers/data-access';

import { Offer, OfferSalaryCurrency } from '@jhh/shared/domain';
import {
  ExchangeRate,
  ExtendedOffer,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Component({
  selector: 'jhh-offer-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormatOfferSalaryPipe,
    MatTooltipModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnChanges {
  private readonly clipboard: Clipboard = inject(Clipboard);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly offersFacede: OffersFacade = inject(OffersFacade);
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  @Input({ required: true }) breakpoint: string;
  @Input({ required: true }) offer: Offer;

  currentCurrency$: BehaviorSubject<OfferSalaryCurrency | null>;
  exchangeRates$: Observable<ExchangeRate[] | null>;

  extendedOffer: ExtendedOffer;
  exchangeRates: ExchangeRate[] | null;

  ngOnInit(): void {
    this.currentCurrency$ = this.currencyService.currentCurrency$;
    this.exchangeRates$ = this.offersFacede.exchangeRates$;
    this.exchangeRates$
      .pipe(
        filter((val) => val !== null),
        first(),
        tap((val) => {
          this.exchangeRates = val;
          this.extendOffer();
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offer'] && changes['offer'].currentValue) {
      this.extendOffer();
    }
  }

  private extendOffer(): void {
    this.extendedOffer = {
      ...this.offer,
      statusIcon: GetOfferStatusIcon(this.offer.status),
      convertedSalary: GetOfferSalaryConversion(
        this.offer.salaryCurrency,
        this.offer.minSalary,
        this.offer.maxSalary,
        this.currentCurrency$?.getValue() ?? undefined,
        this.exchangeRates ?? undefined
      ),
    };
  }

  copyEmail(): void {
    this.clipboard.copy(this.offer.email!);
    this.snackbarService.open('E-mail copied to clipboard.');
  }
}
