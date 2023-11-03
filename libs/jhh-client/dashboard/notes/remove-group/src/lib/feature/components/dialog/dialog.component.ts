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
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { RemoveNotesGroupModalService } from '../../service/remove-notes-group-modal.service';

import { NotesGroup } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-remove-notes-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly removeNotesGroupModalService: RemoveNotesGroupModalService =
    inject(RemoveNotesGroupModalService);

  @Input() groupToRemove: NotesGroup;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  removeNotesGroupInProgress$: Observable<boolean>;
  removeNotesGroupError$: Observable<string | null>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeNotesGroupInProgress$ =
      this.notesFacade.removeNotesGroupInProgress$;
    this.removeNotesGroupError$ = this.notesFacade.removeNotesGroupError$;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.removeNotesGroupModalService.clearNotesGroupToRemove();
    });
  }

  closeDialog(): void {
    this.removeNotesGroupModalService.clearNotesGroupToRemove();
  }

  handleRemove(groupId: string): void {
    if (groupId) this.notesFacade.removeNotesGroup(groupId);
  }
}
