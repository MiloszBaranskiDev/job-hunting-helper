import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Note } from '@jhh/shared/interfaces';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

@Component({
  selector: 'jhh-remove-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() noteToRemove: Note;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  removeNoteInProgress$: Observable<boolean>;
  removeNoteError$: Observable<string | null>;
  removeNoteSuccess$: Observable<boolean>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeNoteInProgress$ = this.notesFacade.removeNoteInProgress$;
    this.removeNoteError$ = this.notesFacade.removeNoteError$;
    this.removeNoteSuccess$ = this.notesFacade.removeNoteSuccess$;
    this.handleReset();
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
  }

  handleRemove(noteId: string): void {
    if (noteId) this.notesFacade.removeNote(noteId);
  }

  handleReset(): void {
    this.removeNoteSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (val) {
          this.dialogRef?.close();
        }
      });
  }
}
