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
import { RemoveOfferDialogService } from '../../service/remove-offer-dialog.service';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-remove-offer-dialog',
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
  private readonly removeOfferDialogService: RemoveOfferDialogService = inject(
    RemoveOfferDialogService
  );

  @Input({ required: true }) offer: Offer;
  @ViewChild('dialogContent')
  private readonly dialogContent: TemplateRef<any>;

  removeOfferInProgress$: Observable<boolean>;
  removeOfferError$: Observable<string | null>;
  removeOfferSuccess$: Observable<boolean>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeOfferInProgress$ = this.offersFacade.removeOfferInProgress$;
    this.removeOfferError$ = this.offersFacade.removeOfferError$;
    this.removeOfferSuccess$ = this.offersFacade.removeOfferSuccess$;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  handleRemove(): void {
    this.offersFacade.removeOffer(this.offer.id);
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.removeOfferDialogService.clearOfferToRemove();
    });
  }
}
