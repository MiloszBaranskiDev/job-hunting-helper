import { AbstractControl, ValidatorFn } from '@angular/forms';

export function MaxSizeValidator(maxSizeInBytes: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const contentSizeInBytes: number = new Blob([control.value]).size;
    const sizeExceeded: boolean = contentSizeInBytes > maxSizeInBytes;
    return sizeExceeded
      ? {
          maxsize: {
            currentSize: contentSizeInBytes,
            maxSize: maxSizeInBytes,
          },
        }
      : null;
  };
}
