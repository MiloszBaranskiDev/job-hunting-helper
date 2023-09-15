import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { JhhClientSharedUiToolbarComponent } from '@jhh/jhh-client/shared/ui-toolbar';
import { JhhClientSharedUiSidebarComponent } from '@jhh/jhh-client/shared/ui-sidebar';

@Component({
  selector: 'jhh-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    JhhClientSharedUiToolbarComponent,
    JhhClientSharedUiSidebarComponent,
  ],
  templateUrl: './jhh-client-dashboard-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-shell.component.scss'],
})
export class JhhClientDashboardShellComponent {}
