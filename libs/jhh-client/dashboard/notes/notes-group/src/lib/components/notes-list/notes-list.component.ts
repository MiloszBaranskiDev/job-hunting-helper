import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { Note } from '@jhh/shared/interfaces';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { RemoveNoteModalService } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { EditNoteModalService } from '@jhh/jhh-client/dashboard/notes/edit-note';

@Component({
  selector: 'jhh-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly editNoteModalService: EditNoteModalService =
    inject(EditNoteModalService);
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );

  readonly clientRoute: typeof ClientRoute = ClientRoute;

  @Input() sortedNotes$: Observable<Note[]>;
  @Input() groupSlug$: Observable<string>;

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }

  openEditNoteModal(note: Note): void {
    this.editNoteModalService.openModal(note);
  }

  openRemoveNoteModal(note: Note): void {
    this.removeNoteModalService.openModal(note);
  }
}
