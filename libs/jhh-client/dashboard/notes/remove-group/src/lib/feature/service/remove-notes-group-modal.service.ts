import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NotesGroup } from '@jhh/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RemoveNotesGroupModalService {
  private _notesGroupToRemove$: Subject<NotesGroup | undefined> = new Subject<
    NotesGroup | undefined
  >();
  notesGroupToRemove$: Observable<NotesGroup | undefined> =
    this._notesGroupToRemove$.asObservable();

  openModal(notesGroupToRemove: NotesGroup): void {
    this._notesGroupToRemove$.next(notesGroupToRemove);
  }

  clearNotesGroupToRemove(): void {
    this._notesGroupToRemove$.next(undefined);
  }
}
