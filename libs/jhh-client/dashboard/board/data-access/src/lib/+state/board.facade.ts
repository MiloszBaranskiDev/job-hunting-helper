import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BoardColumn } from '@jhh/shared/interfaces';

import * as BoardSelectors from './board.selectors';

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
}
