import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotesGroup } from '@jhh/shared/interfaces';

import { EditNotesGroupDialogService } from '../../service/edit-notes-group-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'jhh-edit-notes-group',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-notes-group.component.scss'],
})
export class JhhClientDashboardEditNotesGroupComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);

  notesGroupToEdit$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.editNotesGroupDialogService.notesGroupToEdit$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((val) => {
        this.notesGroupToEdit$ = of(val);
      })
    );
  }
}
