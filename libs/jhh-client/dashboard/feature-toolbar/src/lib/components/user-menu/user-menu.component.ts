import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

@Component({
  selector: 'jhh-user-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  handleLogout(): void {
    this.authFacade.logout();
  }
}
