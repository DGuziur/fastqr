import { Injectable, signal, WritableSignal } from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import { HistoryItem } from '../features/history/history.component';

interface QrData {
  qrValue: WritableSignal<string>;
  qrBackground: WritableSignal<string>;
  qrColor: WritableSignal<string>;
  qrLevel: WritableSignal<ErrorCodeLevel>;
  qrIcon: WritableSignal<string>;
  qrIconName: WritableSignal<string>;
  qrIconSize: WritableSignal<number>;
  qrTransparent: WritableSignal<boolean>;
  qrMargin: WritableSignal<number>;
  editQr(qr: HistoryItem): void;
}

@Injectable({
  providedIn: 'root',
})
export class QrDataService implements QrData {
  qrValue = signal('');
  qrBackground = signal('#ffffff');
  qrColor = signal('#000000');
  qrLevel = signal<ErrorCodeLevel>('L');
  qrIcon = signal('');
  qrIconName = signal('');
  qrIconSize = signal<number>(30);
  qrTransparent = signal<boolean>(false);
  qrMargin = signal<number>(4);

  editQr(qr: HistoryItem) {
    this.qrValue.set(qr.qrValue);
    this.qrBackground.set(qr.qrBackground);
    this.qrColor.set(qr.qrColor);
    this.qrLevel.set(<ErrorCodeLevel>qr.qrLevel);
    this.qrIcon.set(qr.qrIcon);
    this.qrIconName.set(qr.qrIconName);
    this.qrTransparent.set(qr.qrTransparent || false);
  }
}
