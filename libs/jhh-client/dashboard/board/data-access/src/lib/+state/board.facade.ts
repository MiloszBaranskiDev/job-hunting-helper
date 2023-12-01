import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BoardColumn } from '@jhh/shared/interfaces';

import * as BoardSelectors from './board.selectors';
import * as BoardActions from './board.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class BoardFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  boardColumns$: Observable<BoardColumn[]> = this.store.pipe(
    select(BoardSelectors.selectBoardColumns)
  );

  duplicateBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectDuplicateBoardColumnInProgress)
  );

  duplicateBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectDuplicateBoardColumnError)
  );

  removeBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectRemoveBoardColumnInProgress)
  );

  removeBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectRemoveBoardColumnError)
  );

  duplicateBoardColumn(columnId: string) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.duplicateBoardColumn({
        payload: { columnId: columnId },
      }),
      BoardActions.Type.DuplicateBoardColumnSuccess,
      BoardActions.Type.DuplicateBoardColumnFail
    );
  }

  removeBoardColumn(columnId: string) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.removeBoardColumn({
        payload: { columnId: columnId },
      }),
      BoardActions.Type.RemoveBoardColumnSuccess,
      BoardActions.Type.RemoveBoardColumnFail
    );
  }
}
