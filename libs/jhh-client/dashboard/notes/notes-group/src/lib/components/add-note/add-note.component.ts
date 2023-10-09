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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import DOMPurify from 'dompurify';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { maxSizeValidator } from '@jhh/jhh-client/shared/util-max-size-validator';
import { BytesToMbPipe } from '@jhh/jhh-client/shared/pipes';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NoteFieldsLength, NoteSize } from '@jhh/shared/enums';
import { FormField } from '../../enums/form-field';
import { FormErrorKey } from '../../enums/form-error-key';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';

@Component({
  selector: 'jhh-add-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    WhitespaceSanitizerDirective,
    QuillModule,
    MatDividerModule,
    ReactiveFormsModule,
    BytesToMbPipe,
  ],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent implements OnInit, AfterViewInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() groupId$: Observable<string>;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  addNoteInProgress$: Observable<boolean>;
  addNoteError$: Observable<string | null>;
  addNoteSuccess$: Observable<boolean>;

  readonly formField: typeof FormField = FormField;
  readonly fieldsLength: typeof NoteFieldsLength = NoteFieldsLength;
  readonly formErrorKey: typeof FormErrorKey = FormErrorKey;
  readonly noteSize: typeof NoteSize = NoteSize;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  private quillInstance: any;
  formGroup: FormGroup;
  editorModules: object;

  ngOnInit(): void {
    this.addNoteInProgress$ = this.notesFacade.addNoteInProgress$;
    this.addNoteError$ = this.notesFacade.addNoteError$;
    this.addNoteSuccess$ = this.notesFacade.addNoteSuccess$;

    this.editorModules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],
          ['link', 'image', 'video'],
        ],
        handlers: {
          image: this.imageHandler.bind(this),
        },
      },
    };

    this.handleReset();
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    this.setupClipboardMatcher();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
  }

  onEditorCreated(quill: any): void {
    this.quillInstance = quill;

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));

    this.setupClipboardMatcher();
  }

  setupClipboardMatcher(): void {
    if (!this.quillInstance) {
      return;
    }

    const Delta = Quill.import('delta');

    this.quillInstance.clipboard.addMatcher(
      Node.ELEMENT_NODE,
      (node: any, delta: any) => {
        const newDelta = new Delta();

        delta.ops.forEach((op: any) => {
          if (op.insert && !op.insert.image) {
            newDelta.insert(op.insert);
          }
        });

        return newDelta;
      }
    );
  }

  imageHandler(): void {
    const tooltip = this.quillInstance.theme.tooltip;
    const originalSave = tooltip.save;

    tooltip.save = () => {
      const imageTooltip: Element | null = document.querySelector(
        '.ql-tooltip[data-mode="image"]'
      );
      const inputElement: HTMLInputElement | null = imageTooltip
        ? imageTooltip.querySelector('input[type="text"]')
        : null;
      const value: string | null = inputElement ? inputElement.value : null;

      if (value && !value.match(/\.(jpeg|jpg|gif|png)$/i)) {
        alert('Please provide a valid image URL');
        return;
      }

      const selection = this.quillInstance.getSelection();
      const index = selection
        ? selection.index
        : this.quillInstance.getLength();

      this.quillInstance.insertEmbed(index, 'image', value);

      if (inputElement) inputElement.value = '';
      if (imageTooltip) imageTooltip.classList.remove('ql-editing');

      tooltip.hide();
      tooltip.save = originalSave;
    };

    tooltip.edit('image');
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

      this.notesFacade.addNote(name, content, groupId);
    }
  }

  handleReset(): void {
    this.addNoteSuccess$
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
        '',
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinNameLength),
          Validators.maxLength(this.fieldsLength.MaxNameLength),
        ],
      ],
      [this.formField.Content]: [
        '',
        [maxSizeValidator(this.noteSize.MaxNoteSize)],
      ],
    });
  }
}
