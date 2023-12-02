import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { Observable, tap } from 'rxjs';

import {
  BoardColumnField,
  BoardColumnFormErrorKey,
} from '@jhh/jhh-client/dashboard/board/domain';
import { BoardColumnFieldsLength } from '@jhh/shared/enums';

import { ColorValidator } from '@jhh/jhh-client/dashboard/board/util-color-validator';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'jhh-board-add-column',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    WhitespaceSanitizerDirective,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './add-column.component.html',
  styleUrls: ['./add-column.component.scss'],
})
export class AddColumnComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  readonly formField: typeof BoardColumnField = BoardColumnField;
  readonly fieldsLength: typeof BoardColumnFieldsLength =
    BoardColumnFieldsLength;
  readonly formErrorKey: typeof BoardColumnFormErrorKey =
    BoardColumnFormErrorKey;
  private readonly defaultColor: string = '#54a0ff';

  addBoardColumnSuccess$: Observable<boolean>;
  addBoardColumnInProgress$: Observable<boolean>;
  addBoardColumnError$: Observable<string | null>;

  ngOnInit(): void {
    this.addBoardColumnSuccess$ = this.boardFacade.addBoardColumnSuccess$;
    this.addBoardColumnInProgress$ = this.boardFacade.addBoardColumnInProgress$;
    this.addBoardColumnError$ = this.boardFacade.addBoardColumnError$;

    this.initFormGroup();
    this.handleReset();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.formGroup.reset({
        [this.formField.Color]: this.defaultColor,
      });
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      const color = this.formGroup.get(this.formField.Color)?.value;
      if (name && color) {
        this.boardFacade.addBoardColumn(name, color);
      }
    }
  }

  private handleReset(): void {
    this.addBoardColumnSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
            this.formGroup.reset({
              [this.formField.Color]: this.defaultColor,
            });
            this.dialogRef?.close();
          }
        })
      )
      .subscribe();
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Name]: [
        '',
        [
          Validators.required,
          Validators.minLength(BoardColumnFieldsLength.MinColumnNameLength),
          Validators.maxLength(BoardColumnFieldsLength.MaxColumnNameLength),
        ],
      ],
      [this.formField.Color]: [
        this.defaultColor,
        [Validators.required, ColorValidator],
      ],
    });
  }
}