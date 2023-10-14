import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { EditNoteModalService } from '../../service/edit-note-modal.service';

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
  private readonly editNoteModalService: EditNoteModalService =
    inject(EditNoteModalService);

  noteToEdit$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.editNoteModalService.noteToEdit$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.noteToEdit$ = of(val);
      });
  }
}
