import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { Note } from '@jhh/shared/interfaces';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

@Component({
  selector: 'jhh-note-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() groupId: string;

  query$: Subject<string> = new Subject<string>();
  foundNotes$: Observable<Note[]>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  searchStarted: boolean = false;

  // TRACKBY;

  ngOnInit(): void {
    this.handleQuery();
  }

  onSearch(query: string): void {
    this.loading$.next(this.searchStarted);
    this.searchStarted = !!query;
    this.query$.next(query);
  }

  handleQuery(): void {
    this.foundNotes$ = this.query$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => this.loading$.next(true)),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((query) => {
        if (query === '') {
          return of([]);
        } else {
          return this.notesFacade.searchNotesByNameAndGroupId$(
            query,
            this.groupId
          );
        }
      }),
      tap(() => this.loading$.next(false))
    );
  }
}
