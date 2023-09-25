import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

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

  private slug: string;

  group$: Observable<NotesGroup>;
  notes$: Observable<Note[]>;

  ngOnInit(): void {
    this.slug = this.route.snapshot.params['id'];
    this.group$ = this.notesFacade.getNotesGroup$BySlug(
      this.slug
    ) as Observable<NotesGroup>;
    this.notes$ = this.group$.pipe(
      map((group) => {
        return group?.notes;
      })
    );
  }
}
