import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Note, NotesGroup } from '@jhh/shared/interfaces';
import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

@Component({
  selector: 'jhh-note-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() note: Note;

  groups$: Observable<NotesGroup[] | null>;
  editNoteSuccess$: Observable<boolean>;
  changeNoteGroupSuccess$: Observable<boolean>;
  removeNoteSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.groups$ = this.notesFacade.getGroups$();
    this.editNoteSuccess$ = this.notesFacade.editNoteSuccess$;
    this.changeNoteGroupSuccess$ = this.notesFacade.changeNoteGroupSuccess$;
    this.removeNoteSuccess$ = this.notesFacade.removeNoteSuccess$;

    this.navigateAfterSlugChange();
    this.navigateAfterGroupChange();
    this.navigateAfterRemove();
  }

  openEditNoteDialog(): void {
    this.editNoteDialogService.openDialog(this.note);
  }

  openChangeNoteGroupDialog(): void {
    this.changeNoteGroupDialogService.openDialog(this.note);
  }

  handleDuplicate(): void {
    this.notesFacade.duplicateNote(this.note.id, this.note.groupId);
  }

  openRemoveNoteDialog(): void {
    this.removeNoteDialogService.openDialog(this.note);
  }

  private navigateAfterSlugChange(): void {
    this.editNoteSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => val === true),
        switchMap(() =>
          this.notesFacade.getNoteSlug$ByIds(this.note.id, this.note.groupId)
        ),
        filter((slug) => slug !== null && slug !== this.note.slug),
        tap((slug) => {
          const currentLink: string = this.router.url;
          if (currentLink.includes(this.note.slug)) {
            const newNoteLink: string = currentLink.replace(
              this.note.slug,
              slug!
            );
            this.router
              .navigate([''], { skipLocationChange: true })
              .then(() => {
                this.router.navigate([newNoteLink]);
              });
          }
        }),
        catchError((error) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  private navigateAfterGroupChange(): void {
    this.changeNoteGroupSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => val === true),
        switchMap(() => this.notesFacade.getGroupSlug$ByNoteId(this.note.id)),
        tap((groupSlug) => {
          const currentLink: string = this.router.url;
          const shouldNavigate: boolean =
            currentLink.includes(this.note.slug) &&
            !currentLink.includes(groupSlug!);

          if (shouldNavigate) {
            this.router.navigate([ClientRoute.NotesLink + '/' + groupSlug]);
          }
        })
      )
      .subscribe();
  }

  private navigateAfterRemove(): void {
    this.removeNoteSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => val === true),
        switchMap(() =>
          this.notesFacade.getNoteSlug$ByIds(this.note.id, this.note.groupId)
        ),
        catchError((error) => {
          this.router.navigate([this.router.url.replace(this.note.slug, '')]);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
