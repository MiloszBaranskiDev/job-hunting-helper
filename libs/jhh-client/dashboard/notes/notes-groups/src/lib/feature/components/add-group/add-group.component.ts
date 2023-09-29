import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { first, Observable } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroupFieldsLength } from '@jhh/shared/enums';
import { AddNotesGroupFormField } from '../../enums/add-notes-group-form-field';
import { AddNotesGroupFormErrorKey } from '../../enums/add-notes-group-form-error-key';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

@Component({
  selector: 'jhh-add-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    WhitespaceSanitizerDirective,
  ],
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit, OnDestroy {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  readonly fieldsLength: typeof NotesGroupFieldsLength = NotesGroupFieldsLength;
  readonly formField: typeof AddNotesGroupFormField = AddNotesGroupFormField;
  readonly formErrorKey: typeof AddNotesGroupFormErrorKey =
    AddNotesGroupFormErrorKey;

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  addNotesGroupInProgress$: Observable<boolean> =
    this.notesFacade.addNotesGroupInProgress$;
  addNotesGroupError$: Observable<string | null> =
    this.notesFacade.addNotesGroupError$;
  addNotesGroupSuccess$: Observable<boolean> =
    this.notesFacade.addNotesGroupSuccess$;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.initFormGroup();
    this.handleReset();
  }

  ngOnDestroy(): void {
    this.notesFacade.resetAddNotesGroupSuccess();
  }

  initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.name]: [
        '',
        [
          Validators.required,
          Validators.minLength(NotesGroupFieldsLength.MinNotesGroupNameLength),
          Validators.maxLength(NotesGroupFieldsLength.MaxNotesGroupNameLength),
        ],
      ],
    });
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.name)?.value;
      this.notesFacade.addNotesGroup(name).pipe(first());
    }
  }

  handleReset(): void {
    this.addNotesGroupSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (val) {
          this.formGroup.reset();
          this.dialogRef?.close();
          this.snackbarService.open('Group added successfully!');
        }
      });
  }
}
