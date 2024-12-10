import { WritableSignal } from '@angular/core';
import { InjectionToken } from '@angular/core';

function patchSignal<T>(signal: WritableSignal<T>, newValue: Partial<T>) {
  signal.update((state: T) => ({
    ...state,
    ...newValue,
  }));
}

export const SignalUtils = new InjectionToken<typeof patchSignal>(
  'SignalUtils',
  {
    providedIn: 'root',
    factory: () => patchSignal,
  }
);
