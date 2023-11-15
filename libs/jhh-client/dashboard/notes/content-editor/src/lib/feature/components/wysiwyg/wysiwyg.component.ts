import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Quill from 'quill';
import { QuillModule } from 'ngx-quill';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'jhh-note-content-wysiwyg',
  standalone: true,
  imports: [CommonModule, QuillModule, ReactiveFormsModule],
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WysiwygComponent),
      multi: true,
    },
  ],
})
export class WysiwygComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @Input() formControl: FormControl;
  @Output() editorCreated: EventEmitter<any> = new EventEmitter<any>();

  private quillInstance: any;
  editorModules: object;

  ngOnInit(): void {
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
        scrollingContainer: 'html',
      },
    };
  }

  ngAfterViewInit(): void {
    this.setupClipboardMatcher();
  }

  onEditorCreated(quill: any): void {
    this.quillInstance = quill;

    const toolbar = quill.getModule('toolbar');
    const toolbarContainer = toolbar.container;
    toolbar.addHandler('image', this.imageHandler.bind(this));

    // fix jumping on first interaction with toolbar
    setTimeout(() => {
      const editorElement: any = document.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.focus();
      }
    }, 300);

    toolbarContainer.addEventListener('mousedown', (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    });
    // end fix

    this.setupClipboardMatcher();
    this.editorCreated.emit(quill);
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

  writeValue(value: any): void {
    if (value !== undefined) {
      this.quillInstance?.setContents(value);
    }
  }

  registerOnChange(fn: any): void {
    this.quillInstance?.on('text-change', () =>
      fn(this.quillInstance?.getContents())
    );
  }

  registerOnTouched(fn: any): void {
    this.quillInstance?.on('selection-change', (range: any) => {
      if (range == null) fn();
    });
  }

  setDisabledState(isDisabled: boolean): void {
    this.quillInstance?.enable(!isDisabled);
  }
}
