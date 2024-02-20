import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { RemoveOffersDialogService } from '../../services/remove-offers-dialog.service';

import { Offer } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-remove-offers-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);

  @Input({ required: true }) offers: Offer[];
  @ViewChild('dialogContent')
  private readonly dialogContent: TemplateRef<any>;

  removeOffersInProgress$: Observable<boolean>;
  removeOffersError$: Observable<string | null>;
  removeOffersSuccess$: Observable<boolean>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeOffersInProgress$ = this.offersFacade.removeOffersInProgress$;
    this.removeOffersError$ = this.offersFacade.removeOffersError$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  handleRemove(): void {
    const offersId: string[] = this.offers.map((offer) => offer.id);
    this.offersFacade.removeOffers(offersId);
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.removeOffersDialogService.clearOffersToRemove();
    });
  }
}
