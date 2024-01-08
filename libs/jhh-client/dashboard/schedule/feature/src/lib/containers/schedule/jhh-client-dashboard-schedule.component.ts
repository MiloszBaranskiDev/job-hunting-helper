import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  selector: 'jhh-schedule',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './jhh-client-dashboard-schedule.component.html',
  styleUrls: ['./jhh-client-dashboard-schedule.component.scss'],
})
export class JhhClientDashboardScheduleComponent {}
