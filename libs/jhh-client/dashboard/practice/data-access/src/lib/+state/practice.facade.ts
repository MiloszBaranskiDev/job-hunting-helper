import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Quiz } from '@jhh/shared/interfaces';

import * as PracticeSelectors from './practice.selectors';

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

  getQuiz$BySlug(slug: string): Observable<Quiz | undefined> {
    return this.store.pipe(select(PracticeSelectors.selectQuizBySlug, slug));
  }
}
