import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotesGroup } from '@jhh/shared/interfaces';

import { RemoveNotesGroupDialogService } from '../../service/remove-notes-group-dialog.service';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'jhh-remove-notes-group',
  standalone: true,
  imports: [CommonModule, DialogComponent, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-notes-group.component.scss'],
})
export class JhhClientDashboardRemoveNotesGroupComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);

  notesGroupToRemove$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.removeNotesGroupDialogService.notesGroupToRemove$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.notesGroupToRemove$ = of(val);
      });
  }
}
