import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

import { Note } from '@jhh/shared/interfaces';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

@Component({
  selector: 'jhh-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jhh-client-dashboard-notes-single-note.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-single-note.component.scss'],
})
export class JhhClientDashboardNotesSingleNoteComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  note$: Observable<Note>;

  ngOnInit(): void {
    this.note$ = this.route.params.pipe(
      map((params) => ({
        groupSlug: params['groupSlug'],
        noteSlug: params['noteSlug'],
      })),
      switchMap((slugs) =>
        this.notesFacade.getNote$BySlugs(slugs.groupSlug, slugs.noteSlug)
      )
    ) as Observable<Note>;
  }
}
