import { Injectable, signal } from '@angular/core';
import { HistoryItem } from '../features/history/history.component';

const STORAGE_KEY = 'fastqr-history';
const SESSION_KEY = 'fastqr-session';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public history = signal<HistoryItem[]>([]);

  constructor() {
    this.refreshHistory();
  }

  async getAllSavedQrs(): Promise<HistoryItem[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        resolve(result[STORAGE_KEY] || []);
      });
    });
  }

  async saveQr(qr: HistoryItem): Promise<void> {
    const history = await this.getAllSavedQrs();
    history.push(qr);

    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: history }, () => {
        this.refreshHistory();
        resolve();
      });
    });
  }

  async removeQr(qr: HistoryItem): Promise<void> {
    const history = await this.getAllSavedQrs();
    const index = history.findIndex((item) => item.createdAt === qr.createdAt);

    if (index !== -1) {
      history.splice(index, 1);
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: history }, () => {
          this.refreshHistory();
          resolve();
        });
      });
    }
  }

  async clearHistory(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(STORAGE_KEY, () => {
        this.refreshHistory();
        resolve();
      });
    });
  }

  async getQrByDate(createdAt: string): Promise<HistoryItem | undefined> {
    const history = await this.getAllSavedQrs();
    return history.find((item) => item.createdAt === createdAt);
  }

  async saveSession(item: HistoryItem): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.session.set({ [SESSION_KEY]: item }, () => {
        this.refreshHistory();
        resolve();
      });
    });
  }

  async restoreLastSession() {
    return new Promise((resolve) => {
      chrome.storage.session.get(SESSION_KEY, (result) => {
        resolve(result[SESSION_KEY] || null);
      });
    });
  }

  private async refreshHistory(): Promise<void> {
    const history = await this.getAllSavedQrs();
    this.history.set(history);
  }
}
