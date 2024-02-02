import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { first, Observable, tap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotesGroup } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';

@Component({
  selector: 'jhh-notes-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() group: NotesGroup;

  editNotesGroupSuccess$: Observable<boolean>;
  removeNotesGroupSuccess$: Observable<boolean>;

  readonly clientRoute: typeof ClientRoute = ClientRoute;

  ngOnInit(): void {
    this.editNotesGroupSuccess$ = this.notesFacade.editNotesGroupSuccess$;
    this.removeNotesGroupSuccess$ = this.notesFacade.removeNotesGroupSuccess$;

    this.navigateAfterEdit();
    this.navigateAfterRemove();
  }

  openEditNotesGroupDialog(): void {
    this.editNotesGroupDialogService.openDialog(this.group);
  }

  openRemoveNotesGroupDialog(): void {
    this.removeNotesGroupDialogService.openDialog(this.group);
  }

  private navigateAfterEdit(): void {
    let currentQueryParams: Params;

    this.route.queryParams
      .pipe(
        first(),
        tap((params) => {
          currentQueryParams = params;
        })
      )
      .subscribe();

    this.editNotesGroupSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
            this.notesFacade
              .getGroupSlug$ByGroupId(this.group.id)
              .pipe(
                first(),
                tap((slug) => {
                  if (slug) {
                    this.router
                      .navigateByUrl('', { skipLocationChange: true })
                      .then(() => {
                        this.router.navigate(
                          [`${this.clientRoute.NotesLink}/${slug}`],
                          { queryParams: currentQueryParams }
                        );
                      });
                  } else {
                    this.router.navigate([this.clientRoute.NotesLink]);
                  }
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
  }

  private navigateAfterRemove(): void {
    this.removeNotesGroupSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
            this.router.navigate([
              this.router.url.replace(this.group.slug, ''),
            ]);
          }
        })
      )
      .subscribe();
  }
}
