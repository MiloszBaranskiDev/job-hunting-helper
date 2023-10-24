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

import { Note } from '@jhh/shared/interfaces';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { RemoveNoteModalService } from '../../service/remove-note-modal.service';

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
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );

  @Input() noteToRemove: Note;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

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

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
  }

  closeDialog(): void {
    this.removeNoteModalService.clearNoteToRemove();
  }

  handleRemove(noteId: string): void {
    if (noteId) this.notesFacade.removeNote(noteId);
  }
}
