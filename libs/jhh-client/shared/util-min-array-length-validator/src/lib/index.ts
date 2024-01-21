import { AbstractControl, ValidatorFn } from '@angular/forms';

export function MinArrayLengthValidator(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || !Array.isArray(control.value)) {
      return null;
    }

    if (control.value.length >= min) {
      return null;
    }

    return {
      invalidMinArrayLength: true,
    };
  };
}
