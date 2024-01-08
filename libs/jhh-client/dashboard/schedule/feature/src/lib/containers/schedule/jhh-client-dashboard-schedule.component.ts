import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView } from 'angular-calendar';

import { ViewToggleComponent } from '../../components/view-toggle/view-toggle.component';
import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  selector: 'jhh-schedule',
  standalone: true,
  imports: [CommonModule, CalendarComponent, ViewToggleComponent],
  templateUrl: './jhh-client-dashboard-schedule.component.html',
  styleUrls: ['./jhh-client-dashboard-schedule.component.scss'],
})
export class JhhClientDashboardScheduleComponent {
  view: CalendarView = CalendarView.Month;

  setView(view: CalendarView): void {
    this.view = view;
  }
}
