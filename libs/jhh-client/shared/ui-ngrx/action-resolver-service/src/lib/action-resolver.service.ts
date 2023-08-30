import { inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import {
  catchError,
  filter,
  first,
  Observable,
  switchMap,
  takeUntil,
  throwError,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionResolverService {
  private readonly store: Store = inject(Store);
  private readonly actions$: Actions = inject(Actions);

  executeAndWatch<T>(
    initialAction: Action,
    successActionType: string,
    failureActionType: string,
    duration: number = 30000
  ): Observable<T> {
    const timeout$ = timer(duration);

    this.store.dispatch(initialAction);

    return this.actions$.pipe(
      filter(
        (action: Action) =>
          action.type === successActionType || action.type === failureActionType
      ),
      first(),
      switchMap((action: Action) => {
        if (action.type === successActionType) {
          return [(action as any).payload as T];
        }
        throw (action as any).payload || new Error('Operation failed');
      }),
      takeUntil(timeout$),
      catchError((error) => {
        if (!error) {
          return throwError(new Error('Operation timed out'));
        }
        return throwError(error);
      })
    );
  }
}
