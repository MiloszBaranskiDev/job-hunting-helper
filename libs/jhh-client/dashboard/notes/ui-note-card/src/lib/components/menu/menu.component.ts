import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNoteModalService } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { ChangeNoteGroupModalService } from '@jhh/jhh-client/dashboard/notes/change-note-group';
import { RemoveNoteModalService } from '@jhh/jhh-client/dashboard/notes/remove-note';

import { Note } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-note-card-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly editNoteModalService: EditNoteModalService =
    inject(EditNoteModalService);
  private readonly changeNoteGroupModalService: ChangeNoteGroupModalService =
    inject(ChangeNoteGroupModalService);
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );

  @Input() note: Note;

  handleDuplicate(note: Note) {
    this.notesFacade.duplicateNote(note.id, note.groupId);
  }

  openEditNoteModal(note: Note): void {
    this.editNoteModalService.openModal(note);
  }

  openChangeNoteGroupModal(note: Note): void {
    this.changeNoteGroupModalService.openModal(note);
  }

  openRemoveNoteModal(note: Note): void {
    this.removeNoteModalService.openModal(note);
  }
}
