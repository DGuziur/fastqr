import { Injectable, signal } from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import { HistoryItem } from '../features/history/history.component';

@Injectable({
  providedIn: 'root',
})
export class QrDataService {
  qrValue = signal('');
  qrBackground = signal('#ffffff');
  qrColor = signal('#000000');
  qrLevel = signal<ErrorCodeLevel>('L');
  qrIcon = signal('');
  qrIconName = signal('');
  qrIconSize = signal<number>(30);
  qrTransparent = signal<boolean>(false);

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
