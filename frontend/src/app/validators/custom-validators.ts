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

export function integersOnly(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value && !/^\d+$/.test(value)) {
      return {positiveInteger: true};
    }
    return null;
  };
}

export function matchControls(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mismatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mismatch: true});
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  }
}
