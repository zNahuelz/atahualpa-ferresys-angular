import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === 0 ? {notZero: true} : null;
  };
}

export function greaterThanValidator(firstControl: string, secondControl: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(firstControl);
    const compareControl = formGroup.get(secondControl);

    if (!control || !compareControl) return null;
    if (control.value === null || compareControl.value === null) return null;

    return control.value > compareControl.value ? null : {greaterThan: true};
  };
}

export function greaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null; // Ignore empty values
    return value > 0 ? null : {greaterThanZero: true}; // Check if value is greater than 0
  };
}

export function greaterThanZeroWithDecimalsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null; // Ignore empty values
    return value > 0 && !isNaN(value) ? null : {greaterThanZeroWithDecimals: true}; // Ensure value is greater than 0
  };
}
