import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import { HistoryItem } from '../features/history/history.component';
import { SnackbarService } from './snackbar.service';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
  GradientType,
} from 'qr-code-styling';
import { ColorStops } from '../components/gradient-input/gradient-input.component';

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

  qrDotsGradient = signal<boolean>(true);
  qrDotsGradientType = signal<GradientType>('linear');
  qrDotsGradientRotation = signal<number>(0);
  qrDotsColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);
  qrBackgroundGradient = signal<boolean>(true);
  qrBackgroundGradientType = signal<GradientType>('linear');
  qrBackgroundGradientRotation = signal<number>(0);
  qrBackgroundColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);
  qrCornerSquareGradient = signal<boolean>(true);
  qrCornerSquareGradientType = signal<GradientType>('linear');
  qrCornerSquareGradientRotation = signal<number>(0);
  qrCornerSquareColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);
  qrCornerDotGradient = signal<boolean>(true);
  qrCornerDotGradientType = signal<GradientType>('linear');
  qrCornerDotGradientRotation = signal<number>(0);
  qrCornerDotColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);

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
    this.qrBackgroundGradient.set(false);
    this.qrBackgroundGradientType.set('linear');
    this.qrBackgroundGradientRotation.set(0);
    this.qrBackgroundColorStops.set(DEFAULT_COLOR_STOPS);
    this.qrCornerSquareGradient.set(true);
    this.qrCornerSquareGradientType.set('linear');
    this.qrCornerSquareGradientRotation.set(0);
    this.qrCornerSquareColorStops.set(DEFAULT_COLOR_STOPS);
    this.qrCornerDotGradient.set(false);
    this.qrCornerDotGradientType.set('linear');
    this.qrCornerDotGradientRotation.set(0);
    this.qrCornerDotColorStops.set(DEFAULT_COLOR_STOPS);
    this.qrDotsGradient.set(false);
    this.qrDotsGradientType.set('linear');
    this.qrDotsGradientRotation.set(0);
    this.qrDotsColorStops.set(DEFAULT_COLOR_STOPS);
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
    this.qrBackgroundGradient.set(qr.qrBackgroundGradient);
    this.qrBackgroundGradientType.set(qr.qrBackgroundGradientData?.type);
    this.qrBackgroundGradientRotation.set(
      qr.qrBackgroundGradientData?.rotation
    );
    this.qrBackgroundColorStops.set(qr.qrBackgroundGradientData?.colorStops);
    this.qrCornerSquareGradient.set(qr.qrCornerSquareGradient);
    this.qrCornerSquareGradientType.set(qr.qrCornerSquareGradientData?.type);
    this.qrCornerSquareGradientRotation.set(
      qr.qrCornerSquareGradientData?.rotation
    );
    this.qrCornerSquareColorStops.set(
      qr.qrCornerSquareGradientData?.colorStops
    );
    this.qrCornerDotGradient.set(qr.qrCornerDotGradient);
    this.qrCornerDotGradientType.set(qr.qrCornerDotGradientData?.type);
    this.qrCornerDotGradientRotation.set(qr.qrCornerDotGradientData?.rotation);
    this.qrCornerDotColorStops.set(qr.qrCornerDotGradientData?.colorStops);
    this.qrDotsGradient.set(qr.qrDotsGradient);
    this.qrDotsGradientType.set(qr.qrDotsGradientData?.type);
    this.qrDotsGradientRotation.set(qr.qrDotsGradientData?.rotation);
    this.qrDotsColorStops.set(qr.qrDotsGradientData?.colorStops);
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
      dotsOptions: this.qrDotsGradient()
        ? {
            type: this.qrDotsType(),
            gradient: {
              type: this.qrDotsGradientType(),
              rotation: this.qrDotsGradientRotation(),
              colorStops: this.qrDotsColorStops(),
            },
          }
        : {
            color: this.qrColor(),
            type: this.qrDotsType(),
          },
      backgroundOptions:
        this.qrBackgroundGradient() && !this.qrTransparent()
          ? {
              gradient: {
                type: this.qrBackgroundGradientType(),
                rotation: this.qrBackgroundGradientRotation(),
                colorStops: this.qrBackgroundColorStops(),
              },
            }
          : {
              color: this.qrTransparent() ? 'transparent' : this.qrBackground(),
            },
      cornersSquareOptions: this.qrCornerSquareGradient()
        ? {
            type: this.qrSquareType(),
            gradient: {
              type: this.qrCornerSquareGradientType(),
              rotation: this.qrCornerSquareGradientRotation(),
              colorStops: this.qrCornerSquareColorStops(),
            },
          }
        : {
            type: this.qrSquareType(),
            color: this.qrCornerSquare(),
          },
      cornersDotOptions: this.qrCornerDotGradient()
        ? {
            type: this.qrCornerDotType(),
            gradient: {
              type: this.qrCornerDotGradientType(),
              rotation: this.qrCornerDotGradientRotation(),
              colorStops: this.qrCornerDotColorStops(),
            },
          }
        : {
            color: this.qrCornerDot(),
            type: this.qrCornerDotType(),
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
      dotsOptions: this.qrDotsGradient()
        ? {
            type: this.qrDotsType(),
            gradient: {
              type: this.qrDotsGradientType(),
              rotation: this.qrDotsGradientRotation(),
              colorStops: this.qrDotsColorStops(),
            },
          }
        : {
            color: this.qrColor(),
            type: this.qrDotsType(),
          },
      backgroundOptions:
        this.qrBackgroundGradient() && !this.qrTransparent()
          ? {
              gradient: {
                type: this.qrBackgroundGradientType(),
                rotation: this.qrBackgroundGradientRotation(),
                colorStops: this.qrBackgroundColorStops(),
              },
            }
          : {
              color: this.qrTransparent() ? 'transparent' : this.qrBackground(),
            },
      cornersSquareOptions: this.qrCornerSquareGradient()
        ? {
            type: this.qrSquareType(),
            gradient: {
              type: this.qrCornerSquareGradientType(),
              rotation: this.qrCornerSquareGradientRotation(),
              colorStops: this.qrCornerSquareColorStops(),
            },
          }
        : {
            type: this.qrSquareType(),
            color: this.qrCornerSquare(),
          },
      cornersDotOptions: this.qrCornerDotGradient()
        ? {
            type: this.qrCornerDotType(),
            gradient: {
              type: this.qrCornerDotGradientType(),
              rotation: this.qrCornerDotGradientRotation(),
              colorStops: this.qrCornerDotColorStops(),
            },
          }
        : {
            color: this.qrCornerDot(),
            type: this.qrCornerDotType(),
          },
      qrOptions: {
        errorCorrectionLevel: this.qrLevel(),
      },
    });
  }
}

export const DEFAULT_COLOR_STOPS: ColorStops = [
  { offset: 0, color: '#ffffff' },
  { offset: 1, color: '#77779C' },
];
