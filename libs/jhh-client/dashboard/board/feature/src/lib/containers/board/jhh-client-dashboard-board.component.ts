import {
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ColumnsComponent } from '../../components/columns/columns.component';
import { AddColumnComponent } from '../../components/add-column/add-column.component';

import { BoardColumn } from '@jhh/shared/domain';

import {
  BoardFacade,
  updateBoardColumnsSuccess,
} from '@jhh/jhh-client/dashboard/board/data-access';

@Component({
  selector: 'jhh-board',
  standalone: true,
  imports: [CommonModule, ColumnsComponent, AddColumnComponent],
  templateUrl: './jhh-client-dashboard-board.component.html',
  styleUrls: ['./jhh-client-dashboard-board.component.scss'],
})
export class JhhClientDashboardBoardComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly actions$: Actions<any> = inject(Actions);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  boardColumns$: Observable<BoardColumn[]>;
  isSaving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  wasUpdateTriggeredByColumnsComponent$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  @HostBinding('class.isSaving') get isSavingClass() {
    return this.isSaving$.getValue();
  }

  ngOnInit(): void {
    this.boardColumns$ = this.boardFacade.boardColumns$;

    this.actions$
      .pipe(
        ofType(updateBoardColumnsSuccess),
        tap(() => {
          this.wasUpdateTriggeredByColumnsComponent$.next(true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
