import { Component, inject, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { Note } from '@jhh/shared/interfaces';

import { EditNoteModalService } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { RemoveNoteModalService } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

@Component({
  selector: 'jhh-note-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  private readonly router: Router = inject(Router);
  private editNoteModalService: EditNoteModalService =
    inject(EditNoteModalService);
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() note: Note;

  ngOnDestroy(): void {
    this.router.navigate([this.router.url.replace(this.note.slug, '')]);
  }

  handleDuplicate(note: Note) {
    this.notesFacade.duplicateNote(note.id, note.groupId);
  }

  openEditNoteModal(note: Note): void {
    this.editNoteModalService.openModal(note);
  }

  openRemoveNoteModal(note: Note): void {
    this.removeNoteModalService.openModal(note);
  }
}
