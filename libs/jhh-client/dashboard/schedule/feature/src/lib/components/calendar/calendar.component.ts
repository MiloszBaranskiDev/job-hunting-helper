import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';

import { ScheduleEvent } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-schedule-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
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

  protected readonly CalendarView = CalendarView;

  private _events: ScheduleEvent[];
  calendarEvents: CalendarEvent[];
  refresh: Subject<void> = new Subject<void>();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

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

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd,
  // }: CalendarEventTimesChangedEvent): void {
  //   this.events = this.events.map((iEvent) => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd,
  //       };
  //     }
  //     return iEvent;
  //   });
  //   this.handleEvent('Dropped or resized', event);
  // }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if (action === 'Clicked' && event.id) {
      this.clickedEventId$.next(String(event.id));
    }
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
