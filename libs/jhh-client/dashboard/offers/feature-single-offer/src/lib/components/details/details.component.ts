import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';

import { GetStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-status-icon';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-offer-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  private readonly clipboard: Clipboard = inject(Clipboard);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  @Input({ required: true }) breakpoint: string;
  @Input({ required: true }) offer: Offer;

  statusIcon: string;

  ngOnInit(): void {
    this.statusIcon = GetStatusIcon(this.offer.status);
  }

  copyEmail(): void {
    this.clipboard.copy(this.offer.email!);
    this.snackbarService.open('E-mail copied to clipboard.');
  }
}
