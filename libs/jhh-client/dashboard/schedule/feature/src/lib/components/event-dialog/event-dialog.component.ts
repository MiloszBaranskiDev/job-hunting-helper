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
import { distinctUntilChanged, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ScheduleEvent } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-schedule-event-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTabsModule, MatIconModule],
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

  dialogRef: MatDialogRef<TemplateRef<any>>;
  event: ScheduleEvent;

  ngOnInit(): void {
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
    });
  }

  private closeDialog(): void {
    this.dialogRef?.close();
  }
}
