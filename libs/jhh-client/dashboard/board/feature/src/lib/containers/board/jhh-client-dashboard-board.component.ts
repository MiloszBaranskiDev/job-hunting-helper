import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { ColumnsComponent } from '../../components/columns/columns.component';
import { AddColumnComponent } from '../../components/add-column/add-column.component';

import { BoardColumn } from '@jhh/shared/interfaces';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

@Component({
  selector: 'jhh-board',
  standalone: true,
  imports: [CommonModule, ColumnsComponent, AddColumnComponent],
  templateUrl: './jhh-client-dashboard-board.component.html',
  styleUrls: ['./jhh-client-dashboard-board.component.scss'],
})
export class JhhClientDashboardBoardComponent implements OnInit {
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  boardColumns$: Observable<BoardColumn[]>;
  isSaving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @HostBinding('class.isSaving') get isSavingClass() {
    return this.isSaving$.getValue();
  }

  ngOnInit(): void {
    this.boardColumns$ = this.boardFacade.boardColumns$;
  }
}
