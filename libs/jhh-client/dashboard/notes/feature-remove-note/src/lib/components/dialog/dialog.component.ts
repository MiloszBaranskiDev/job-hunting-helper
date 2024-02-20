import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Note } from '@jhh/shared/domain';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { RemoveNoteDialogService } from '../../services/remove-note-dialog.service';

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
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );

  @Input() noteToRemove: Note;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  removeNoteInProgress$: Observable<boolean>;
  removeNoteError$: Observable<string | null>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeNoteInProgress$ = this.notesFacade.removeNoteInProgress$;
    this.removeNoteError$ = this.notesFacade.removeNoteError$;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  handleRemove(noteId: string): void {
    if (noteId) this.notesFacade.removeNote(noteId);
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.removeNoteDialogService.clearNoteToRemove();
    });
  }
}
