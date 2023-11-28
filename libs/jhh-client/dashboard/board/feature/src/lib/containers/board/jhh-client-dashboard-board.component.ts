import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnsComponent } from '../../components/columns/columns.component';

@Component({
  selector: 'jhh-board',
  standalone: true,
  imports: [CommonModule, ColumnsComponent],
  templateUrl: './jhh-client-dashboard-board.component.html',
  styleUrls: ['./jhh-client-dashboard-board.component.scss'],
})
export class JhhClientDashboardBoardComponent {}
