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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import DOMPurify from 'dompurify';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { maxSizeValidator } from '@jhh/jhh-client/shared/util-max-size-validator';
import { BytesToMbPipe } from '@jhh/jhh-client/shared/pipes';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

import { JhhClientDashboardNoteContentEditorComponent } from '@jhh/jhh-client/dashboard/notes/content-editor';

import { Note } from '@jhh/shared/interfaces';

import { NoteFieldsLength, NoteSize } from '@jhh/shared/enums';
import { FormField } from '../../enums/form-field';
import { FormErrorKey } from '../../enums/form-error-key';

@Component({
  selector: 'jhh-edit-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatInputModule,
    BytesToMbPipe,
    WhitespaceSanitizerDirective,
    JhhClientDashboardNoteContentEditorComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() noteToEdit: Note;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  editNoteInProgress$: Observable<boolean>;
  editNoteError$: Observable<string | null>;
  editNoteSuccess$: Observable<boolean>;

  readonly formField: typeof FormField = FormField;
  readonly fieldsLength: typeof NoteFieldsLength = NoteFieldsLength;
  readonly formErrorKey: typeof FormErrorKey = FormErrorKey;
  readonly noteSize: typeof NoteSize = NoteSize;

  private quillInstance: any;
  private dialogRef: MatDialogRef<TemplateRef<any>>;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.editNoteInProgress$ = this.notesFacade.editNoteInProgress$;
    this.editNoteError$ = this.notesFacade.editNoteError$;
    this.editNoteSuccess$ = this.notesFacade.editNoteSuccess$;

    this.handleReset();
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
  }

  handleEditorCreated(quill: any): void {
    this.quillInstance = quill;
  }

  onSubmit(groupId: string): void {
    if (this.quillInstance) {
      const html = this.quillInstance.root.innerHTML;
      this.formGroup
        .get(this.formField.Content)
        ?.setValue(html, { emitEvent: false });
    }

    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      const content = DOMPurify.sanitize(
        this.formGroup.get(this.formField.Content)?.value,
        domPurifyConfig
      );

      if (
        name !== this.noteToEdit.name ||
        content !== this.noteToEdit.content
      ) {
        this.notesFacade.editNote(this.noteToEdit.id, name, content, groupId);
      } else {
        this.formGroup.reset();
        this.dialogRef?.close();
      }
    }
  }

  handleReset(): void {
    this.editNoteSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (val) {
          this.formGroup.reset();
          this.dialogRef?.close();
        }
      });
  }

  getContentSizeInBytes(): number {
    const contentValue =
      this.formGroup.get(this.formField.Content)?.value || '';

    return new Blob([contentValue]).size;
  }

  initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Name]: [
        this.noteToEdit.name,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinNameLength),
          Validators.maxLength(this.fieldsLength.MaxNameLength),
        ],
      ],
      [this.formField.Content]: [
        this.noteToEdit.content,
        [maxSizeValidator(this.noteSize.MaxNoteSize)],
      ],
    });
  }

  getContentControl(): FormControl {
    const control = this.formGroup.get(this.formField.Content);

    if (control instanceof FormControl) {
      return control;
    }

    throw new Error('Content control is missing or not a FormControl');
  }
}
