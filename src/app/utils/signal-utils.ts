import { WritableSignal } from '@angular/core';

export function patchSignal<T>(
  signal: WritableSignal<T>,
  newValue: Partial<T>
) {
  signal.update((state: T) => ({
    ...state,
    ...newValue,
  }));
}
