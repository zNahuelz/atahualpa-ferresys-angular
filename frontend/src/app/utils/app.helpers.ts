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
