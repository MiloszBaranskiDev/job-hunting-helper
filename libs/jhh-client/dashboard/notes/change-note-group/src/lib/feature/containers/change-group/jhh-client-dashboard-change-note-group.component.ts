import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';

import { Note } from '@jhh/shared/interfaces';

import { DialogComponent } from '../../components/dialog/dialog.component';
import { ChangeNoteGroupDialogService } from '../../service/change-note-group-dialog.service';

@Component({
  selector: 'jhh-change-note-group',
  standalone: true,
  imports: [CommonModule, DialogComponent, DialogComponent],
  templateUrl: './jhh-client-dashboard-change-note-group.component.html',
  styleUrls: ['./jhh-client-dashboard-change-note-group.component.scss'],
})
export class JhhClientDashboardChangeNoteGroupComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);

  noteToMove$: Observable<Note | undefined>;

  ngOnInit(): void {
    this.changeNoteGroupDialogService.noteToMove$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.noteToMove$ = of(val);
      });
  }
}
