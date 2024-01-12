import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView } from 'angular-calendar';
import { Observable } from 'rxjs';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { CalendarComponent } from '../../components/calendar/calendar.component';
import { ViewToggleComponent } from '../../components/view-toggle/view-toggle.component';
import { ViewDateToggleComponent } from '../../components/view-date-toggle/view-date-toggle.component';
import { AddComponent } from '../../components/add/add.component';

import { ScheduleEvent } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-schedule',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    ViewToggleComponent,
    ViewDateToggleComponent,
    AddComponent,
  ],
  templateUrl: './jhh-client-dashboard-schedule.component.html',
  styleUrls: ['./jhh-client-dashboard-schedule.component.scss'],
})
export class JhhClientDashboardScheduleComponent implements OnInit {
  private readonly scheduleFacade: ScheduleFacade = inject(ScheduleFacade);

  events$: Observable<ScheduleEvent[]>;

  view: CalendarView = CalendarView.Month;
  isActiveDayOpen: boolean = true;
  viewDate: Date = new Date();

  ngOnInit(): void {
    this.events$ = this.scheduleFacade.events$;
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  toggleIsActiveDayOpen(bool: boolean): void {
    this.isActiveDayOpen = bool;
  }
}
