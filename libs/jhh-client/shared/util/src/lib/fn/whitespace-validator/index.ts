import { AbstractControl, ValidatorFn } from '@angular/forms';

export function WhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasWhitespace = /\s/.test(control.value);
    const isValid = !hasWhitespace;
    return isValid ? null : { whitespace: 'value has whitespace' };
  };
}
