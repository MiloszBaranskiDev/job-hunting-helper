import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { SidebarService } from '../service/sidebar.service';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

interface SidebarItem {
  icon: string;
  text: string;
  route: ClientRoute;
}

@Component({
  selector: 'jhh-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './jhh-client-dashboard-ui-sidebar.component.html',
  styleUrls: ['./jhh-client-dashboard-ui-sidebar.component.scss'],
})
export class JhhClientDashboardUiSidebarComponent implements OnInit {
  private readonly sidebarService: SidebarService = inject(SidebarService);

  isBreakpointMobile$: Observable<boolean>;
  isSidebarOpened$: Observable<boolean>;
  isSidebarExpanded$: Observable<boolean>;

  readonly sidebarItems: SidebarItem[] = [
    { icon: 'home', text: 'Home', route: ClientRoute.HomeLink },
    { icon: 'note_add', text: 'Notes', route: ClientRoute.NotesLink },
  ];

  ngOnInit(): void {
    this.isBreakpointMobile$ = this.sidebarService.isBreakpointMobile$;
    this.isSidebarOpened$ = this.sidebarService.isSidebarOpened$;
    this.isSidebarExpanded$ = this.sidebarService.isSidebarExpanded$;
  }

  handleClose(): void {
    this.sidebarService.toggleSidebar();
  }
}
