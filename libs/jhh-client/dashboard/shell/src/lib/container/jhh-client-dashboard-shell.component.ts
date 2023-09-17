import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { JhhClientDashboardUiToolbarComponent } from '@jhh/jhh-client/dashboard/ui-toolbar';
import { JhhClientDashboardUiSidebarComponent } from '@jhh/jhh-client/dashboard/ui-sidebar';

@Component({
  selector: 'jhh-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    JhhClientDashboardUiToolbarComponent,
    JhhClientDashboardUiSidebarComponent,
  ],
  templateUrl: './jhh-client-dashboard-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-shell.component.scss'],
})
export class JhhClientDashboardShellComponent {}
