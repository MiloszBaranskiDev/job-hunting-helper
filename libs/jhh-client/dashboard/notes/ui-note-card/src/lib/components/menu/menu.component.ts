import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/change-note-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/remove-note';

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
  private readonly editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );

  @Input() note: Note;

  handleDuplicate() {
    this.notesFacade.duplicateNote(this.note.id, this.note.groupId);
  }

  openEditNoteDialog(): void {
    this.editNoteDialogService.openDialog(this.note);
  }

  openChangeNoteGroupDialog(): void {
    this.changeNoteGroupDialogService.openDialog(this.note);
  }

  openRemoveNoteDialog(): void {
    this.removeNoteDialogService.openDialog(this.note);
  }
}
