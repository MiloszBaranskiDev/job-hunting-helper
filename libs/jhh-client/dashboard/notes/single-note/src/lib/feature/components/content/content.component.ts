import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'jhh-note-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  @Input() content: string;

  contentHtml: SafeHtml;

  ngOnInit(): void {
    this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(this.content);
  }
}
