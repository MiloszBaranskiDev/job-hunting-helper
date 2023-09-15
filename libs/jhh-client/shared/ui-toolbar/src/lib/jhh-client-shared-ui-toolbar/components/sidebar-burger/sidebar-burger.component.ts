import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SidebarService } from '@jhh/jhh-client/shared/ui-sidebar';

@Component({
  selector: 'jhh-sidebar-burger',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './sidebar-burger.component.html',
  styleUrls: ['./sidebar-burger.component.scss'],
})
export class SidebarBurgerComponent {
  private readonly sidebarService: SidebarService = inject(SidebarService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
