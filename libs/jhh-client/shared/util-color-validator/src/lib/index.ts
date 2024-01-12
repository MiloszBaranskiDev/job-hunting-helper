import { AbstractControl } from '@angular/forms';

export function ColorValidator(
  control: AbstractControl
): { invalidColor: boolean } | null {
  if (!control.value) {
    return null;
  }

  const hexColorRegex: RegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

  if (hexColorRegex.test(control.value)) {
    return null;
  } else {
    return { invalidColor: true };
  }
}
