import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { SidebarBurgerComponent } from '../../components/sidebar-burger/sidebar-burger.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';

@Component({
  selector: 'jhh-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    MatSlideToggleModule,
    ThemeSwitcherComponent,
    SidebarBurgerComponent,
    UserMenuComponent,
  ],
  templateUrl: './jhh-client-dashboard-feature-toolbar.component.html',
  styleUrls: ['./jhh-client-dashboard-feature-toolbar.component.scss'],
})
export class JhhClientDashboardFeatureToolbarComponent {}
