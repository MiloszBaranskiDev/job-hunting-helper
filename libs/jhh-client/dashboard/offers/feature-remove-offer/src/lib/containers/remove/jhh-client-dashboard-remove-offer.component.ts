import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { RemoveOfferDialogService } from '../../service/remove-offer-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-remove-offer',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-offer.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-offer.component.scss'],
})
export class JhhClientDashboardRemoveOfferComponent {
  private readonly removeOfferDialogService: RemoveOfferDialogService = inject(
    RemoveOfferDialogService
  );

  offerToRemove$: Observable<Offer | undefined>;

  ngOnInit(): void {
    this.offerToRemove$ = this.removeOfferDialogService.offerToRemove$;
  }
}
