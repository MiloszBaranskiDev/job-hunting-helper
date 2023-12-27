import { AbstractControl, ValidatorFn } from '@angular/forms';

export function EnumValidator(enumObj: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values = Object.values(enumObj);
    if (values.includes(control.value)) {
      return null;
    }
    return { enumInvalid: { value: control.value } };
  };
}
