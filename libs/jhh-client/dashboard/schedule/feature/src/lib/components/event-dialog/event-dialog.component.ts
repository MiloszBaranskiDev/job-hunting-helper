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
import { distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ScheduleEvent } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-schedule-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly scheduleFacade: ScheduleFacade = inject(ScheduleFacade);

  @Input({ required: true }) clickedEventId$: Subject<string | null>;
  @ViewChild('dialogContent')
  private readonly dialogContent: TemplateRef<any>;

  removeEventInProgress$: Observable<boolean>;
  removeEventError$: Observable<string | null>;
  removeEventSuccess$: Observable<boolean>;

  dialogRef: MatDialogRef<TemplateRef<any>>;
  event: ScheduleEvent;
  removeConfirmationText: string = '';
  readonly expectedRemoveConfirmationTexts: string[] = [
    'remove',
    '"remove"',
    `'remove'`,
  ];

  ngOnInit(): void {
    this.removeEventInProgress$ = this.scheduleFacade.removeEventInProgress$;
    this.removeEventError$ = this.scheduleFacade.removeEventError$;
    this.removeEventSuccess$ = this.scheduleFacade.removeEventSuccess$;

    this.clickedEventId$
      .pipe(
        tap((val) => {
          if (val) {
            this.openDialog(val);
          } else {
            this.closeDialog();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.handleReset();
  }

  handleRemove(): void {
    this.scheduleFacade.removeEvent(this.event.id);
  }

  isRemoveConfirmationValid(): boolean {
    return this.expectedRemoveConfirmationTexts.includes(
      this.removeConfirmationText.toLowerCase()
    );
  }

  private openDialog(id: string): void {
    this.scheduleFacade
      .getEvent$ById(id)
      .pipe(
        tap((val) => {
          if (val) {
            this.event = val;
            this.dialogRef = this.dialog.open(this.dialogContent);
          }
        }),
        distinctUntilChanged()
      )
      .subscribe();

    this.dialogRef?.afterClosed().subscribe(() => {
      this.clickedEventId$.next(null);
      this.removeConfirmationText = '';
    });
  }

  private closeDialog(): void {
    this.dialogRef?.close();
  }

  private handleReset(): void {
    this.removeEventSuccess$
      .pipe(
        tap((val) => {
          if (val) {
            this.clickedEventId$.next(null);
            this.removeConfirmationText = '';
            this.closeDialog();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
