import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { RemoveNoteDialogService } from '../../service/remove-note-dialog.service';

import { Note } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-remove-note',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-note.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-note.component.scss'],
})
export class JhhClientDashboardRemoveNoteComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );

  noteToRemove$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.removeNoteDialogService.noteToRemove$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          this.noteToRemove$ = of(val);
        })
      )
      .subscribe();
  }
}
