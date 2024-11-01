import { Injectable, signal } from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';

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
}
