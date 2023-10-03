import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Note } from '@jhh/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RemoveNoteModalService {
  private _noteToRemove$: Subject<Note | undefined> = new Subject<
    Note | undefined
  >();
  noteToRemove$: Observable<Note | undefined> =
    this._noteToRemove$.asObservable();

  openModal(noteToRemove: Note): void {
    this._noteToRemove$.next(noteToRemove);
  }

  clearNoteToRemove(): void {
    this._noteToRemove$.next(undefined);
  }
}
