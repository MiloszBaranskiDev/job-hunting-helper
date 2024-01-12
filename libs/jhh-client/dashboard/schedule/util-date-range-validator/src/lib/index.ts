import { FormGroup, ValidationErrors } from '@angular/forms';

export function DateRangeValidator(
  startControlName: string,
  endControlName: string
): (formGroup: FormGroup) => ValidationErrors | null {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const startControl = formGroup.get(startControlName);
    const endControl = formGroup.get(endControlName);

    if (!startControl || !endControl) {
      return null;
    }

    const startDate = startControl.value;
    const endDate = endControl.value;

    if (startDate && endDate && endDate < startDate) {
      endControl.setErrors({ invalidDateRange: true });
      return { invalidDateRange: true };
    }

    if (endControl.errors && endControl.errors['invalidDateRange']) {
      delete endControl.errors['invalidDateRange'];
      if (Object.keys(endControl.errors).length === 0) {
        endControl.setErrors(null);
      }
    }

    return null;
  };
}
