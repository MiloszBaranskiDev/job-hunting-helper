import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotesGroup } from '@jhh/shared/interfaces';

import { RemoveNotesGroupModalService } from '@jhh/jhh-client/dashboard/notes/remove-group';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

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
  private readonly router: Router = inject(Router);
  private readonly removeNotesGroupModalService: RemoveNotesGroupModalService =
    inject(RemoveNotesGroupModalService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() group: NotesGroup;

  removeNotesGroupSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.removeNotesGroupSuccess$ = this.notesFacade.removeNotesGroupSuccess$;

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

  openRemoveNotesGroupModal(): void {
    this.removeNotesGroupModalService.openModal(this.group);
  }
}
