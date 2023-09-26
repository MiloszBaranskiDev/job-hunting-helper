import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, pluck, switchMap } from 'rxjs';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { Note, NotesGroup } from '@jhh/shared/interfaces';

import { NotesListComponent } from '../../components/notes-list/notes-list.component';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [CommonModule, NotesListComponent],
  templateUrl: './jhh-client-dashboard-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-group.component.scss'],
})
export class JhhClientDashboardNotesGroupComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  group$: Observable<NotesGroup>;
  groupSlug$: Observable<string>;
  notes$: Observable<Note[]>;

  ngOnInit(): void {
    this.groupSlug$ = this.route.params.pipe(
      pluck('groupSlug')
    ) as Observable<string>;

    this.group$ = this.groupSlug$.pipe(
      switchMap((slug: string) => this.notesFacade.getNotesGroup$BySlug(slug))
    ) as Observable<NotesGroup>;

    this.notes$ = this.group$.pipe(pluck('notes'));
  }
}
