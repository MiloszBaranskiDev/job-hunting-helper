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

import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';
import { FormatOfferSalaryPipe } from '@jhh/jhh-client/dashboard/offers/util-format-offer-salary';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-offer-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormatOfferSalaryPipe],
  providers: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnChanges {
  private readonly clipboard: Clipboard = inject(Clipboard);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  @Input({ required: true }) breakpoint: string;
  @Input({ required: true }) offer: Offer;

  statusIcon: string;

  ngOnInit(): void {
    this.statusIcon = GetOfferStatusIcon(this.offer.status);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offer'] && changes['offer'].currentValue) {
      this.statusIcon = GetOfferStatusIcon(this.offer.status);
    }
  }

  copyEmail(): void {
    this.clipboard.copy(this.offer.email!);
    this.snackbarService.open('E-mail copied to clipboard.');
  }
}
