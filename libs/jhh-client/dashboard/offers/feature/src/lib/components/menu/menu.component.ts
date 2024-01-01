import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { RemoveOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offer';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-offers-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );
  private readonly removeOfferDialogService: RemoveOfferDialogService = inject(
    RemoveOfferDialogService
  );

  @Input({ required: true }) offer: Offer;

  openEditOfferDialog(): void {
    this.editOfferDialogService.openDialog(this.offer);
  }

  openRemoveOfferDialog(): void {
    this.removeOfferDialogService.openDialog(this.offer);
  }
}
