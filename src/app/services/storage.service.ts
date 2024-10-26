import { Injectable, signal } from '@angular/core';
import { HistoryItem } from '../features/history/history.component';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public history = signal<HistoryItem[]>([]);
  constructor() {
    this.refreshHistory();
  }

  getAllSavedQrs(): HistoryItem[] {
    return localStorage['fastqr-history']
      ? JSON.parse(localStorage['fastqr-history'])
      : [];
  }

  saveQr(qr: HistoryItem) {
    const history = this.getAllSavedQrs();
    history.push(qr);
    localStorage['fastqr-history'] = JSON.stringify(history);
    this.refreshHistory();
  }

  removeQr(qr: HistoryItem) {
    const history = this.getAllSavedQrs();
    const index = history.findIndex((item) => item.createdAt === qr.createdAt);
    history.splice(index, 1);
    localStorage['fastqr-history'] = JSON.stringify(history);
    this.refreshHistory();
  }

  clearHistory() {
    localStorage.removeItem('fastqr-history');
    this.refreshHistory();
  }

  getQrByDate(createdAt: string): HistoryItem | undefined {
    return this.getAllSavedQrs().find((item) => item.createdAt === createdAt);
  }

  private refreshHistory() {
    this.history.set(this.getAllSavedQrs());
  }
}
