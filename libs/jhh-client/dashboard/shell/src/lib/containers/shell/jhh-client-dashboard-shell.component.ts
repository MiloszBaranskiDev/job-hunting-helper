import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JhhClientDashboardFeatureToolbarComponent } from '@jhh/jhh-client/dashboard/feature-toolbar';
import { JhhClientDashboardFeatureSidebarComponent } from '@jhh/jhh-client/dashboard/feature-sidebar';
import { JhhClientDashboardBreadcrumbsComponent } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';

import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';

@Component({
  selector: 'jhh-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatProgressSpinnerModule,
    JhhClientDashboardFeatureToolbarComponent,
    JhhClientDashboardFeatureSidebarComponent,
    JhhClientDashboardBreadcrumbsComponent,
  ],
  templateUrl: './jhh-client-dashboard-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-shell.component.scss'],
})
export class JhhClientDashboardShellComponent implements OnInit {
  private readonly dashboardFacade: DashboardFacade = inject(DashboardFacade);

  loadAssignedDataInProgress$: Observable<boolean> =
    this.dashboardFacade.loadAssignedDataInProgress$;
  loadAssignedDataError$: Observable<string | null> =
    this.dashboardFacade.loadAssignedDataError$;

  ngOnInit(): void {
    this.dashboardFacade.loadAssignedData();
  }
}
