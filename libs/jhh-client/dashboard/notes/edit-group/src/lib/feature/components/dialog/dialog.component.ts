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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

import { NotesGroupFieldsLength } from '@jhh/shared/enums';
import { FormField } from '../../enums/form-field';
import { FormErrorKey } from '../../enums/form-error-key';
import { ClientRoute } from '@jhh/jhh-client/shared/enums';
import { NotesGroup } from '@jhh/shared/interfaces';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNotesGroupModalService } from '../../service/edit-notes-group-modal.service';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

@Component({
  selector: 'jhh-edit-notes-group-dialog',
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
    WhitespaceSanitizerDirective,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly editNotesGroupModalService: EditNotesGroupModalService =
    inject(EditNotesGroupModalService);

  @Input() groupToEdit: NotesGroup;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  editNotesGroupInProgress$: Observable<boolean>;
  editNotesGroupError$: Observable<string | null>;

  readonly formField: typeof FormField = FormField;
  readonly fieldsLength: typeof NotesGroupFieldsLength = NotesGroupFieldsLength;
  readonly formErrorKey: typeof FormErrorKey = FormErrorKey;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  formGroup: FormGroup;
  slugPrefix: string;

  ngOnInit(): void {
    this.editNotesGroupInProgress$ = this.notesFacade.editNotesGroupInProgress$;
    this.editNotesGroupError$ = this.notesFacade.editNotesGroupError$;

    this.initFormGroup();

    this.slugPrefix =
      window.location.href.split(ClientRoute.HomeLink)[0] +
      `${ClientRoute.NotesLink}` +
      '/';
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.formGroup.reset();
    this.dialogRef.close();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.editNotesGroupModalService.clearNotesGroupToEdit();
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      const slug = this.formGroup.get(this.formField.Slug)?.value;

      if (name !== this.groupToEdit.name || slug !== this.groupToEdit.slug) {
        this.notesFacade.editNotesGroup(this.groupToEdit.id, name, slug);
      } else {
        this.formGroup.reset();
        this.dialogRef?.close();
      }
    }
  }

  initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Name]: [
        this.groupToEdit.name,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinNotesGroupNameLength),
          Validators.maxLength(this.fieldsLength.MaxNotesGroupNameLength),
        ],
      ],
      [this.formField.Slug]: [
        this.groupToEdit.slug,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinNotesGroupNameLength),
          Validators.maxLength(this.fieldsLength.MaxNotesGroupNameLength + 10),
        ],
      ],
    });
  }
}
