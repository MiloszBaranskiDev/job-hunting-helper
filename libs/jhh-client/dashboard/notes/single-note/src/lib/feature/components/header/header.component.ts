import { Component, inject, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';

import { Note } from '@jhh/shared/interfaces';
import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { EditNoteModalService } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { RemoveNoteModalService } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { ChangeNoteGroupModalService } from '@jhh/jhh-client/dashboard/notes/change-note-group';

enum RedirectTo {
  Group = 'group',
  NewGroup = 'new-group',
}

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
  private readonly changeNoteGroupModalService: ChangeNoteGroupModalService =
    inject(ChangeNoteGroupModalService);
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() note: Note;

  private redirectTo: null | RedirectTo;

  ngOnDestroy(): void {
    if (this.redirectTo === RedirectTo.Group) {
      this.router.navigate([this.router.url.replace(this.note.slug, '')]);
    } else if (this.redirectTo === RedirectTo.NewGroup) {
      this.notesFacade
        .getGroupSlug$ByNoteId(this.note.id)
        .pipe(
          first(),
          tap((val) => {
            this.router.navigate([ClientRoute.NotesLink + '/' + val]);
          })
        )
        .subscribe();
    }

    this.redirectTo = null;
  }

  openEditNoteModal(note: Note): void {
    this.editNoteModalService.openModal(note);
  }

  openChangeNoteGroupModal(note: Note): void {
    this.redirectTo = RedirectTo.NewGroup;
    this.changeNoteGroupModalService.openModal(note);
  }

  handleDuplicate(note: Note): void {
    this.notesFacade.duplicateNote(note.id, note.groupId);
  }

  openRemoveNoteModal(note: Note): void {
    this.redirectTo = RedirectTo.Group;
    this.removeNoteModalService.openModal(note);
  }
}
