import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-offers-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );

  @Input({ required: true }) offer: Offer;
  @ViewChild('removeDialogContent')
  private readonly removeDialogContent: TemplateRef<any>;

  removeOfferInProgress$: Observable<boolean>;
  removeOfferError$: Observable<string | null>;
  removeOfferSuccess$: Observable<boolean>;

  private dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeOfferInProgress$ = this.offersFacade.removeOfferInProgress$;
    this.removeOfferError$ = this.offersFacade.removeOfferError$;
    this.removeOfferSuccess$ = this.offersFacade.removeOfferSuccess$;

    this.handleReset();
  }

  openRemoveOfferDialog(): void {
    this.dialogRef = this.dialog.open(this.removeDialogContent);
  }

  openEditOfferDialog(): void {
    this.editOfferDialogService.openDialog(this.offer);
  }

  handleRemove(): void {
    this.offersFacade.removeOffer(this.offer.id);
  }

  private handleReset(): void {
    this.removeOfferSuccess$
      .pipe(
        tap((val) => {
          if (val) {
            this.dialogRef?.close();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
