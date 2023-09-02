import { AbstractControl } from '@angular/forms';

export function WhitespaceValidator(control: AbstractControl) {
  const isSpace = (control.value || '').match(/\s/g);
  return isSpace ? { whitespace: true } : null;
}
