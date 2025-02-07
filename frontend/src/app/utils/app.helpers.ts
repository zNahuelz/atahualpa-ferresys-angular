export function allowIntegers(e: KeyboardEvent) {
  if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === ',') {
    e.preventDefault();
  }
}

export function disableNegatives(e: KeyboardEvent) {
  if (e.key === '-' || e.key === 'e') {
    e.preventDefault();
  }
}

export function disableCharacters(e: KeyboardEvent) {
  if (e.key === '"' || e.key === "'") {
    e.preventDefault();
  }
}

export function integersOnly(e: KeyboardEvent) {
  if (
    [46, 8, 9, 27, 13].includes(e.keyCode) || // Special keys
    (e.keyCode >= 48 && e.keyCode <= 57) || // Number keys
    (e.keyCode >= 96 && e.keyCode <= 105) // Numpad keys
  ) {
    return;
  }
  e.preventDefault();
}
