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

  addBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectAddBoardColumnInProgress)
  );

  addBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectAddBoardColumnError)
  );

  addBoardColumnSuccess$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectAddBoardColumnSuccess)
  );

  editBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectEditBoardColumnInProgress)
  );

  editBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectEditBoardColumnError)
  );

  editBoardColumnSuccess$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectEditBoardColumnSuccess)
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

  addBoardColumn(name: string, color: string) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.addBoardColumn({
        payload: { name: name, color: color },
      }),
      BoardActions.Type.AddBoardColumnSuccess,
      BoardActions.Type.AddBoardColumnFail
    );
  }

  editBoardColumn(columnId: string, name: string, color: string) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.editBoardColumn({
        payload: { columnId: columnId, name: name, color: color },
      }),
      BoardActions.Type.EditBoardColumnSuccess,
      BoardActions.Type.EditBoardColumnFail
    );
  }

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
