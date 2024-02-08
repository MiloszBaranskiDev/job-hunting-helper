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

import { NotesGroup, NotesGroupFieldsLength } from '@jhh/shared/domain';
import {
  NotesGroupFormErrorKey,
  NotesGroupFormField,
} from '@jhh/jhh-client/dashboard/notes/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNotesGroupDialogService } from '../../service/edit-notes-group-dialog.service';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

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
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);

  @Input() groupToEdit: NotesGroup;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  editNotesGroupInProgress$: Observable<boolean>;
  editNotesGroupError$: Observable<string | null>;
  breakpoint$: Observable<string>;

  readonly formField: typeof NotesGroupFormField = NotesGroupFormField;
  readonly fieldsLength: typeof NotesGroupFieldsLength = NotesGroupFieldsLength;
  readonly formErrorKey: typeof NotesGroupFormErrorKey = NotesGroupFormErrorKey;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  formGroup: FormGroup;
  slugPrefix: string;

  ngOnInit(): void {
    this.editNotesGroupInProgress$ = this.notesFacade.editNotesGroupInProgress$;
    this.editNotesGroupError$ = this.notesFacade.editNotesGroupError$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.slugPrefix =
      window.location.href.split(ClientRoute.HomeLink)[0] +
      `${ClientRoute.NotesLink}` +
      '/';

    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.formGroup?.reset();
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      const slug = this.formGroup.get(this.formField.Slug)?.value;

      if (name !== this.groupToEdit.name || slug !== this.groupToEdit.slug) {
        this.notesFacade.editNotesGroup(this.groupToEdit.id, name, slug);
      } else {
        this.formGroup?.reset();
        this.dialogRef?.close();
      }
    }
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.editNotesGroupDialogService.clearNotesGroupToEdit();
    });
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Name]: [
        this.groupToEdit.name,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinNameLength),
          Validators.maxLength(this.fieldsLength.MaxNameLength),
        ],
      ],
      [this.formField.Slug]: [
        this.groupToEdit.slug,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinNameLength),
          Validators.maxLength(
            this.fieldsLength.MaxNameLength +
              this.fieldsLength.MaxNameAndSlugLengthDiff
          ),
        ],
      ],
    });
  }
}
