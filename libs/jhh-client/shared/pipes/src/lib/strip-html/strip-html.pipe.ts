import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml',
  standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    const doc: Document = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent || '';
  }
}
