import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, Observable, tap } from 'rxjs';
import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { Note } from '@jhh/shared/interfaces';

import { EditNoteModalService } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { RemoveNoteModalService } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { ChangeNoteGroupModalService } from '@jhh/jhh-client/dashboard/notes/change-note-group';

@Component({
  selector: 'jhh-note-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private editNoteModalService: EditNoteModalService =
    inject(EditNoteModalService);
  private readonly changeNoteGroupModalService: ChangeNoteGroupModalService =
    inject(ChangeNoteGroupModalService);
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() note: Note;

  removeNoteSuccess$: Observable<boolean>;
  changeNoteGroupSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.removeNoteSuccess$ = this.notesFacade.removeNoteSuccess$;
    this.changeNoteGroupSuccess$ = this.notesFacade.changeNoteGroupSuccess$;

    this.changeNoteGroupSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
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
        })
      )
      .subscribe();

    this.removeNoteSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
            this.router.navigate([this.router.url.replace(this.note.slug, '')]);
          }
        })
      )
      .subscribe();
  }

  openEditNoteModal(note: Note): void {
    this.editNoteModalService.openModal(note);
  }

  openChangeNoteGroupModal(note: Note): void {
    this.changeNoteGroupModalService.openModal(note);
  }

  handleDuplicate(note: Note): void {
    this.notesFacade.duplicateNote(note.id, note.groupId);
  }

  openRemoveNoteModal(note: Note): void {
    this.removeNoteModalService.openModal(note);
  }
}
