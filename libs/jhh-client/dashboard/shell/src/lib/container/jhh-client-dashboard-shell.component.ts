import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhh-dashboard-shell-jhh-client-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jhh-client-dashboard-shell.component.html',
  styleUrls: ['./jhh-client-dashboard-shell.component.scss'],
})
export class JhhClientDashboardShellComponent {}
