import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BoardColumn } from '@jhh/shared/interfaces';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhh-board-column-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './column-menu.component.html',
  styleUrls: ['./column-menu.component.scss'],
})
export class ColumnMenuComponent implements OnInit, OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @Input({ required: true }) column: BoardColumn;
  @ViewChild('removeDialogContent')
  private readonly removeDialogContent: TemplateRef<any>;

  removeBoardColumnInProgress$: Observable<boolean>;
  removeBoardColumnError$: Observable<string | null>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.removeBoardColumnInProgress$ =
      this.boardFacade.removeBoardColumnInProgress$;
    this.removeBoardColumnError$ = this.boardFacade.removeBoardColumnError$;
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }

  openRemoveColumnDialog(): void {
    this.dialogRef = this.dialog.open(this.removeDialogContent);
  }

  handleRemove(): void {
    this.boardFacade.removeBoardColumn(this.column.id);
  }
}
