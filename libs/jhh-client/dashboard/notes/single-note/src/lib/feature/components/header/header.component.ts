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

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/change-note-group';

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

  editNoteSuccess$: Observable<boolean>;
  changeNoteGroupSuccess$: Observable<boolean>;
  removeNoteSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.editNoteSuccess$ = this.notesFacade.editNoteSuccess$;
    this.changeNoteGroupSuccess$ = this.notesFacade.changeNoteGroupSuccess$;
    this.removeNoteSuccess$ = this.notesFacade.removeNoteSuccess$;

    this.navigateAfterSlugChange();
    this.navigateAfterGroupChange();
    this.navigateAfterRemove();
  }

  navigateAfterSlugChange(): void {
    this.editNoteSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
            this.notesFacade
              .getNoteSlug$ByIds(this.note.id, this.note.groupId)
              .pipe(
                first(),
                tap((slug) => {
                  if (slug && slug !== this.note.slug) {
                    const newNoteLink: string = this.router.url.replace(
                      this.note.slug,
                      slug
                    );
                    this.router.navigate(['']).then(() => {
                      this.router.navigate([newNoteLink]);
                    });
                  }
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
  }

  navigateAfterGroupChange(): void {
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
  }

  navigateAfterRemove(): void {
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
}
