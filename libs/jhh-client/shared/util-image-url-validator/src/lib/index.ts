import { AbstractControl, ValidatorFn } from '@angular/forms';

import { regex } from '@jhh/shared/regex';

export function ImageUrlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const isValid: boolean = regex.imageUrl.test(control.value);

    return isValid ? null : { invalidImageUrl: true };
  };
}
