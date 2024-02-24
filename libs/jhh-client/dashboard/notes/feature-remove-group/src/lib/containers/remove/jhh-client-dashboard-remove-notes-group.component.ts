import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RemoveNotesGroupDialogService } from '../../services/remove-notes-group-dialog.service';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { NotesGroup } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-remove-notes-group',
  standalone: true,
  imports: [CommonModule, DialogComponent, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-notes-group.component.scss'],
})
export class JhhClientDashboardRemoveNotesGroupComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);

  notesGroupToRemove$: Observable<NotesGroup | undefined>;

  ngOnInit(): void {
    this.removeNotesGroupDialogService.notesGroupToRemove$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((group) => {
          this.notesGroupToRemove$ = of(group);
        })
      )
      .subscribe();
  }
}
