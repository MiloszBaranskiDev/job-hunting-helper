import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Note } from '@jhh/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ChangeNoteGroupModalService {
  private _noteToMove$: Subject<Note | undefined> = new Subject<
    Note | undefined
  >();
  noteToMove$: Observable<Note | undefined> = this._noteToMove$.asObservable();

  openModal(noteToMove: Note): void {
    this._noteToMove$.next(noteToMove);
  }

  clearNoteToMove(): void {
    this._noteToMove$.next(undefined);
  }
}
