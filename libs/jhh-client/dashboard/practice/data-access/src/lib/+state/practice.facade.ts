import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Quiz, QuizItem } from '@jhh/shared/interfaces';

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

  addQuizInProgress$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizInProgress)
  );

  addQuizError$: Observable<string | null> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizError)
  );

  addQuizSuccess$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizSuccess)
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

  addQuiz(
    name: string,
    description: string | undefined,
    imageUrl: string | undefined,
    items: QuizItem[]
  ) {
    return this.actionResolverService.executeAndWatch(
      PracticeActions.addQuiz({
        payload: {
          name,
          description,
          imageUrl,
          items,
        },
      }),
      PracticeActions.Type.AddQuizSuccess,
      PracticeActions.Type.AddQuizFail
    );
  }

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