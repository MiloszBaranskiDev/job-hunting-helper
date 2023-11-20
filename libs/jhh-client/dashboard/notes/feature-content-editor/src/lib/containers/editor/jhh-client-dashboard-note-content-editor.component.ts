import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WysiwygComponent } from '../../components/wysiwyg/wysiwyg.component';

@Component({
  selector: 'jhh-note-content-editor',
  standalone: true,
  imports: [CommonModule, WysiwygComponent, ReactiveFormsModule],
  templateUrl: './jhh-client-dashboard-note-content-editor.component.html',
  styleUrls: ['./jhh-client-dashboard-note-content-editor.component.scss'],
})
export class JhhClientDashboardNoteContentEditorComponent {
  @Output() editorCreated: EventEmitter<any> = new EventEmitter<any>();
  @Input() contentControl: FormControl;

  handleEditorCreated(quillInstance: any): void {
    this.editorCreated.emit(quillInstance);
  }
}
