import { Injectable } from '@angular/core';

export const DEFAULT_SETTINGS = {
  qrLocked: false,
};

export type UserSettings = typeof DEFAULT_SETTINGS;

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  qrLocked = false;
}
