import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotesGroup } from '@jhh/shared/interfaces';

import { EditNotesGroupModalService } from '../../service/edit-notes-group-modal.service';

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
  private readonly editNotesGroupModalService: EditNotesGroupModalService =
    inject(EditNotesGroupModalService);

  notesGroupToEdit$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.editNotesGroupModalService.notesGroupToEdit$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.notesGroupToEdit$ = of(val);
      });
  }
}
