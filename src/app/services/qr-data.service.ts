import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import { HistoryItem } from '../features/history/history.component';
import { SnackbarService } from './snackbar.service';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
} from 'qr-code-styling';

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
  private readonly snackbar = inject(SnackbarService);

  qrValue = signal('');

  qrColor = signal('#000000');
  qrBackground = signal('#ffffff');
  qrCornerSquare = signal('#000000');
  qrCornerDot = signal('#000000');

  qrLevel = signal<ErrorCodeLevel>('L');
  qrIcon = signal('');
  qrIconName = signal('');
  qrIconMargin = signal<number>(0);
  qrIconHideBackgroundDots = signal<boolean>(false);
  qrIconSize = signal<number>(0.5);
  qrDotsType = signal<DotType>('rounded');
  qrCornerDotType = signal<CornerDotType>('dot');
  qrSquareType = signal<CornerSquareType>('extra-rounded');
  qrDownloadType = signal<FileExtension>('svg');
  qrTransparent = signal<boolean>(false);
  qrMargin = signal<number>(4);

  resetQr() {
    this.qrValue.set('');
    this.qrBackground.set('#ffffff');
    this.qrColor.set('#000000');
    this.qrCornerSquare.set('#000000');
    this.qrCornerDot.set('#000000');
    this.qrLevel.set('L');
    this.qrIcon.set('');
    this.qrIconName.set('');
    this.qrIconSize.set(0.5);
    this.qrTransparent.set(false);
    this.qrMargin.set(4);
    this.qrCornerDotType.set('dot');
    this.qrSquareType.set('extra-rounded');
    this.qrDotsType.set('rounded');
    this.qrIconMargin.set(0);
    this.qrIconHideBackgroundDots.set(false);
  }

  editQr(qr: HistoryItem) {
    this.qrValue.set(qr.qrValue);
    this.qrBackground.set(qr.qrBackground);
    this.qrColor.set(qr.qrColor);
    this.qrCornerSquare.set(qr.qrCornerSquare);
    this.qrCornerDot.set(qr.qrCornerDot);
    this.qrLevel.set(<ErrorCodeLevel>qr.qrLevel);
    this.qrIcon.set(qr.qrIcon);
    this.qrIconName.set(qr.qrIconName);
    this.qrIconSize.set(qr.qrIconSize);
    this.qrTransparent.set(qr.qrTransparent || false);
    this.qrMargin.set(qr.qrMargin);
    this.qrCornerDotType.set(qr.qrCornerDotType);
    this.qrSquareType.set(qr.qrSquareType);
    this.qrDotsType.set(qr.qrDotsType);
    this.qrIconMargin.set(qr.qrIconMargin);
    this.qrIconHideBackgroundDots.set(qr.qrIconHideBackgroundDots);
  }

  downloadQr(qr: HistoryItem) {
    if (!qr.canvas) throw new Error('Nothing to download');
    const qrCanvas = this.buildQr(qr);
    qrCanvas.download({
      name: qr.qrValue,
      extension: qr.qrDownloadType,
    });
  }

  copyQrToClipboard(qr: HistoryItem) {
    if (!qr.canvas) throw new Error('Nothing to copy');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = qr.canvas;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (!ctx) throw new Error('Canvas context not supported');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) throw new Error('Error while converting qr image to blob');
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      });
    };
    this.snackbar.open('Copied to clipboard');
  }

  goToLink(qr: HistoryItem) {
    if (!qr.qrValue) throw new Error('Nothing to go to');
    chrome.tabs.create({ url: qr.qrValue, active: false });
  }

  buildQr(qr?: HistoryItem) {
    return new QRCodeStyling({
      width: 200,
      height: 200,
      data: qr?.qrValue || this.qrValue(),
      image: qr?.qrIcon || this.qrIcon(),
      margin: qr?.qrMargin || this.qrMargin(),
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: this.qrLevel(),
      },
      imageOptions: {
        hideBackgroundDots:
          qr?.qrIconHideBackgroundDots || this.qrIconHideBackgroundDots(),
        imageSize: qr?.qrIconSize || this.qrIconSize(),
        margin: qr?.qrIconMargin || this.qrIconMargin(),
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: qr?.qrColor || this.qrColor(),
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [
        //     { offset: 0, color: '#8688B2' },
        //     { offset: 1, color: '#77779C' },
        //   ],
        // },
        type: qr?.qrDotsType || this.qrDotsType(),
      },
      backgroundOptions: {
        color: qr?.qrBackground || this.qrBackground(),
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [
        //     { offset: 0, color: '#ededff' },
        //     { offset: 1, color: '#e6e7ff' },
        //   ],
        // },
      },
      cornersSquareOptions: {
        color: qr?.qrCornerSquare || this.qrCornerSquare(),
        type: qr?.qrSquareType || this.qrSquareType(),
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [
        //     { offset: 0, color: '#25456e' },
        //     { offset: 1, color: '#4267b2' },
        //   ],
        // },
      },
      cornersDotOptions: {
        color: qr?.qrCornerDot || this.qrCornerDot(),
        type: qr?.qrCornerDotType || this.qrCornerDotType(),
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [
        //     { offset: 0, color: '#00266e' },
        //     { offset: 1, color: '#4060b3' },
        //   ],
        // },
      },
    });
  }

  updateQr(qr: QRCodeStyling) {
    qr.update({
      data: this.qrValue(),
      image: this.qrIcon(),
      margin: this.qrMargin(),
      imageOptions: {
        imageSize: this.qrIconSize(),
        margin: this.qrIconMargin(),
        hideBackgroundDots: this.qrIconHideBackgroundDots(),
      },
      dotsOptions: {
        color: this.qrColor(),
        type: this.qrDotsType(),
      },
      backgroundOptions: {
        color: this.qrTransparent() ? 'transparent' : this.qrBackground(),
      },
      cornersSquareOptions: {
        color: this.qrCornerSquare(),
        type: this.qrSquareType(),
      },
      cornersDotOptions: {
        color: this.qrCornerDot(),
        type: this.qrCornerDotType(),
      },
      qrOptions: {
        errorCorrectionLevel: this.qrLevel(),
      },
    });
  }
}
