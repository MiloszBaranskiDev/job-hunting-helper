import {
  Component,
  DestroyRef,
  inject,
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
import { first, Observable, tap } from 'rxjs';
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
export class AddGroupComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  readonly fieldsLength: typeof NotesGroupFieldsLength = NotesGroupFieldsLength;
  readonly formField: typeof AddNotesGroupFormField = AddNotesGroupFormField;
  readonly formErrorKey: typeof AddNotesGroupFormErrorKey =
    AddNotesGroupFormErrorKey;

  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  addNotesGroupInProgress$: Observable<boolean>;
  addNotesGroupError$: Observable<string | null>;
  addNotesGroupSuccess$: Observable<boolean>;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.addNotesGroupInProgress$ = this.notesFacade.addNotesGroupInProgress$;
    this.addNotesGroupError$ = this.notesFacade.addNotesGroupError$;
    this.addNotesGroupSuccess$ = this.notesFacade.addNotesGroupSuccess$;

    this.initFormGroup();
    this.handleReset();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.formGroup?.reset();
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      this.notesFacade.addNotesGroup(name).pipe(first());
    }
  }

  private handleReset(): void {
    this.addNotesGroupSuccess$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((val) => {
          if (val) {
            this.formGroup?.reset();
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
          Validators.minLength(NotesGroupFieldsLength.MinNameLength),
          Validators.maxLength(NotesGroupFieldsLength.MaxNameLength),
        ],
      ],
    });
  }
}
