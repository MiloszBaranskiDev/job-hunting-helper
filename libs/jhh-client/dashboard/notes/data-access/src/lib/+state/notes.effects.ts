import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class NotesEffects {
  private readonly actions$ = inject(Actions);
}
