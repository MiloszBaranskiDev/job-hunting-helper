import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { EditNoteDialogService } from '../../service/edit-note-dialog.service';

import { Note } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-edit-note',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-note.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-note.component.scss'],
})
export class JhhClientDashboardEditNoteComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );

  noteToEdit$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.editNoteDialogService.noteToEdit$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.noteToEdit$ = of(val);
      });
  }
}
