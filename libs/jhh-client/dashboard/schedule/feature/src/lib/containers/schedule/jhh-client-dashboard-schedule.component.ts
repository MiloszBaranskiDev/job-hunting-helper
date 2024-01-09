import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView } from 'angular-calendar';

import { CalendarComponent } from '../../components/calendar/calendar.component';
import { ViewToggleComponent } from '../../components/view-toggle/view-toggle.component';
import { ViewDateToggleComponent } from '../../components/view-date-toggle/view-date-toggle.component';

@Component({
  selector: 'jhh-schedule',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    ViewToggleComponent,
    ViewDateToggleComponent,
  ],
  templateUrl: './jhh-client-dashboard-schedule.component.html',
  styleUrls: ['./jhh-client-dashboard-schedule.component.scss'],
})
export class JhhClientDashboardScheduleComponent {
  view: CalendarView = CalendarView.Month;
  isActiveDayOpen: boolean = true;
  viewDate: Date = new Date();

  setView(view: CalendarView): void {
    this.view = view;
  }

  toggleIsActiveDayOpen(bool: boolean): void {
    this.isActiveDayOpen = bool;
  }
}
