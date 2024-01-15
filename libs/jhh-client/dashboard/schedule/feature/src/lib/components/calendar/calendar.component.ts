import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, tap } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ScheduleEvent } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-schedule-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly scheduleFacade: ScheduleFacade = inject(ScheduleFacade);

  @Input({ required: true }) set events(value: ScheduleEvent[]) {
    this._events = value;
    this.refresh.next();
    this.calendarEvents = this._events.map((event) =>
      this.convertToCalendarEvent(event)
    );
  }

  @Input({ required: true }) clickedEventId$: Subject<string | null>;
  @Input({ required: true }) view: CalendarView;
  @Input({ required: true }) viewDate: Date;
  @Input({ required: true }) isActiveDayOpen: boolean;
  @Output() toggleIsActiveDayOpen: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  editEventInProgress$: Observable<boolean>;
  editEventError$: Observable<string | null>;
  editEventSuccess$: Observable<boolean>;

  readonly CalendarView = CalendarView;

  private _events: ScheduleEvent[];
  calendarEvents: CalendarEvent[];
  refresh: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.editEventInProgress$ = this.scheduleFacade.editEventInProgress$;
    this.editEventError$ = this.scheduleFacade.editEventError$;
    this.editEventSuccess$ = this.scheduleFacade.editEventSuccess$;
  }

  get events(): ScheduleEvent[] {
    return this._events;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.isActiveDayOpen === true) ||
        events.length === 0
      ) {
        this.toggleIsActiveDayOpen.emit(false);
      } else {
        this.toggleIsActiveDayOpen.emit(true);
      }
      this.viewDate = date;
    }
  }

  handleTimesChange({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    const calendarEvent: CalendarEvent = this.calendarEvents.find(
      (cEvent) => cEvent.id === event.id
    )!;
    const eventToSave: ScheduleEvent = this._events.find(
      (ev) => ev.id === event.id
    )!;

    calendarEvent.start = newStart;
    calendarEvent.end = newEnd;

    this.refresh.next();

    const savingSnackBar: MatSnackBarRef<TextOnlySnackBar> = this.snackBar.open(
      'Saving data...',
      'Close'
    );

    this.scheduleFacade.editEvent(
      eventToSave.id,
      newStart,
      newEnd!,
      eventToSave.title,
      eventToSave.color,
      eventToSave.description
    );

    this.editEventSuccess$
      .pipe(
        tap((val) => {
          if (val) {
            savingSnackBar.dismiss();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.editEventError$
      .pipe(
        tap((val) => {
          if (val) {
            savingSnackBar.dismiss();
            this.snackBar.open(
              'Something went wrong with saving data.',
              'Close',
              {
                duration: 7000,
              }
            );
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  handleClick(action: string, event: CalendarEvent): void {
    this.clickedEventId$.next(String(event.id));
  }

  private convertToCalendarEvent(event: ScheduleEvent): CalendarEvent {
    return {
      id: event.id,
      start: new Date(event.start),
      end: new Date(event.end),
      title: event.title,
      color: {
        primary: event.color,
        secondary: `rgba(${this.hexToRgb(event.color)}, 0.3)`,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    };
  }

  private hexToRgb(hex: string): number[] {
    const r: number = parseInt(hex.slice(1, 3), 16);
    const g: number = parseInt(hex.slice(3, 5), 16);
    const b: number = parseInt(hex.slice(5, 7), 16);

    return [r, g, b];
  }
}
