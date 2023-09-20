import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { JhhClientDashboardFeatureToolbarComponent } from '@jhh/jhh-client/dashboard/feature-toolbar';
import { JhhClientDashboardFeatureSidebarComponent } from '@jhh/jhh-client/dashboard/feature-sidebar';

@Component({
  selector: 'jhh-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    JhhClientDashboardFeatureToolbarComponent,
    JhhClientDashboardFeatureSidebarComponent,
  ],
  templateUrl: './jhh-client-dashboard-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-shell.component.scss'],
})
export class JhhClientDashboardShellComponent {}
