import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { RemoveOffersDialogService } from '../../service/remove-offers-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { Offer } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-remove-offers',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-offers.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-offers.component.scss'],
})
export class JhhClientDashboardRemoveOffersComponent {
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);

  offersToRemove$: Observable<Offer[] | undefined>;

  ngOnInit(): void {
    this.offersToRemove$ = this.removeOffersDialogService.offersToRemove$;
  }
}
