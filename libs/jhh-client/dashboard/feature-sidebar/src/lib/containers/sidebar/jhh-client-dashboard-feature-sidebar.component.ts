import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, filter, Observable, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { SidebarService } from '../../service/sidebar.service';

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
    RouterLinkActive,
  ],
  templateUrl: './jhh-client-dashboard-feature-sidebar.component.html',
  styleUrls: ['./jhh-client-dashboard-feature-sidebar.component.scss'],
})
export class JhhClientDashboardFeatureSidebarComponent implements OnInit {
  private readonly sidebarService: SidebarService = inject(SidebarService);
  private readonly router: Router = inject(Router);

  activeLink$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isBreakpointMobile$: Observable<boolean>;
  isSidebarOpened$: Observable<boolean>;
  isSidebarExpanded$: Observable<boolean>;

  readonly sidebarItems: SidebarItem[] = [
    { icon: 'home', text: 'Home', route: ClientRoute.HomeLink },
    { icon: 'work', text: 'Offers', route: ClientRoute.OffersLink },
    { icon: 'event', text: 'Schedule', route: ClientRoute.ScheduleLink },
    { icon: 'view_column', text: 'Board', route: ClientRoute.BoardLink },
    { icon: 'school', text: 'Practice', route: ClientRoute.PracticeLink },
    { icon: 'note_add', text: 'Notes', route: ClientRoute.NotesLink },
  ];

  ngOnInit(): void {
    this.isBreakpointMobile$ = this.sidebarService.isBreakpointMobile$;
    this.isSidebarOpened$ = this.sidebarService.isSidebarOpened$;
    this.isSidebarExpanded$ = this.sidebarService.isSidebarExpanded$;

    this.detectActiveLink();
  }

  handleClose(): void {
    this.sidebarService.toggleSidebar();
  }

  private detectActiveLink(): void {
    this.activeLink$.next(this.router.url.split('?')[0]);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          this.activeLink$.next(this.router.url.split('?')[0]);
        })
      )
      .subscribe();
  }
}
