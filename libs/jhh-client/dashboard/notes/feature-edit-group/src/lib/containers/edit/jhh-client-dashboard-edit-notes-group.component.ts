import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EditNotesGroupDialogService } from '../../services/edit-notes-group-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { NotesGroup } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-edit-notes-group',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-notes-group.component.scss'],
})
export class JhhClientDashboardEditNotesGroupComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);

  notesGroupToEdit$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.editNotesGroupDialogService.notesGroupToEdit$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((group) => {
          this.notesGroupToEdit$ = of(group);
        })
      )
      .subscribe();
  }
}
