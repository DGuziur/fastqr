import { Injectable, signal } from '@angular/core';

export const DEFAULT_SETTINGS = {
  qrLocked: false,
  itemsPerPage: 5,
};

export const SETTINGS_KEY = 'fastqr-settings';

export type UserSettings = typeof DEFAULT_SETTINGS;

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  userSettings = signal<UserSettings>(DEFAULT_SETTINGS);

  constructor() {
    this.getSettings();
  }

  getSettings(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(SETTINGS_KEY, (result) => {
        this.userSettings.set(result[SETTINGS_KEY] || DEFAULT_SETTINGS);
        resolve();
      });
    });
  }

  updateSettings(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [SETTINGS_KEY]: this.userSettings() }, () => {
        resolve();
      });
    });
  }
}
