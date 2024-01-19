import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Quiz } from '@jhh/shared/interfaces';

import * as PracticeSelectors from './practice.selectors';
import * as PracticeActions from './practice.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class PracticeFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  quizzes$: Observable<Quiz[]> = this.store.pipe(
    select(PracticeSelectors.selectQuizzes)
  );

  removeQuizInProgress$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectRemoveQuizInProgress)
  );

  removeQuizError$: Observable<string | null> = this.store.pipe(
    select(PracticeSelectors.selectRemoveQuizError)
  );

  removeQuizSuccess$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectRemoveQuizSuccess)
  );

  removeQuiz(quizId: string) {
    return this.actionResolverService.executeAndWatch(
      PracticeActions.removeQuiz({
        payload: { quizId: quizId },
      }),
      PracticeActions.Type.RemoveQuizSuccess,
      PracticeActions.Type.RemoveQuizFail
    );
  }

  getQuiz$BySlug(slug: string): Observable<Quiz | undefined> {
    return this.store.pipe(select(PracticeSelectors.selectQuizBySlug, slug));
  }
}
