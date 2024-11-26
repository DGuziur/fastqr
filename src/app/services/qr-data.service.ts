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

  qrDotsGradient = signal<boolean>(false);
  qrDotsGradientType = signal<GradientType>('linear');
  qrDotsGradientRotation = signal<number>(0);
  qrDotsGradientColor1 = signal<string>('#8688B2');
  qrDotsGradientColor2 = signal<string>('#77779C');
  qrBackgroundGradient = signal<boolean>(false);
  qrBackgroundGradientType = signal<GradientType>('linear');
  qrBackgroundGradientRotation = signal<number>(0);
  qrBackgroundGradientColor1 = signal<string>('#ededff');
  qrBackgroundGradientColor2 = signal<string>('#e6e7ff');
  qrCornerSquareGradient = signal<boolean>(false);
  qrCornerSquareGradientType = signal<GradientType>('linear');
  qrCornerSquareGradientRotation = signal<number>(0);
  qrCornerSquareGradientColor1 = signal<string>('#25456e');
  qrCornerSquareGradientColor2 = signal<string>('#4267b2');
  qrCornerDotGradient = signal<boolean>(false);
  qrCornerDotGradientType = signal<GradientType>('linear');
  qrCornerDotGradientRotation = signal<number>(0);
  qrCornerDotGradientColor1 = signal<string>('#00266e');
  qrCornerDotGradientColor2 = signal<string>('#4060b3');

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
    this.qrBackgroundGradientColor1.set('#ededff');
    this.qrBackgroundGradientColor2.set('#e6e7ff');
    this.qrCornerSquareGradient.set(false);
    this.qrCornerSquareGradientType.set('linear');
    this.qrCornerSquareGradientRotation.set(0);
    this.qrCornerSquareGradientColor1.set('#25456e');
    this.qrCornerSquareGradientColor2.set('#4267b2');
    this.qrCornerDotGradient.set(false);
    this.qrCornerDotGradientType.set('linear');
    this.qrCornerDotGradientRotation.set(0);
    this.qrCornerDotGradientColor1.set('#00266e');
    this.qrCornerDotGradientColor2.set('#4060b3');
    this.qrDotsGradient.set(false);
    this.qrDotsGradientType.set('linear');
    this.qrDotsGradientRotation.set(0);
    this.qrDotsGradientColor1.set('#8688B2');
    this.qrDotsGradientColor2.set('#77779C');
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
    this.qrBackgroundGradientColor1.set(
      qr.qrBackgroundGradientData?.colorStops[0].color
    );
    this.qrBackgroundGradientColor2.set(
      qr.qrBackgroundGradientData?.colorStops[1].color
    );
    this.qrCornerSquareGradient.set(qr.qrCornerSquareGradient);
    this.qrCornerSquareGradientType.set(qr.qrCornerSquareGradientData?.type);
    this.qrCornerSquareGradientRotation.set(
      qr.qrCornerSquareGradientData?.rotation
    );
    this.qrCornerSquareGradientColor1.set(
      qr.qrCornerSquareGradientData?.colorStops[0].color
    );
    this.qrCornerSquareGradientColor2.set(
      qr.qrCornerSquareGradientData?.colorStops[1].color
    );
    this.qrCornerDotGradient.set(qr.qrCornerDotGradient);
    this.qrCornerDotGradientType.set(qr.qrCornerDotGradientData?.type);
    this.qrCornerDotGradientRotation.set(qr.qrCornerDotGradientData?.rotation);
    this.qrCornerDotGradientColor1.set(
      qr.qrCornerDotGradientData?.colorStops[0].color
    );
    this.qrCornerDotGradientColor2.set(
      qr.qrCornerDotGradientData?.colorStops[1].color
    );
    this.qrDotsGradient.set(qr.qrDotsGradient);
    this.qrDotsGradientType.set(qr.qrDotsGradientData?.type);
    this.qrDotsGradientRotation.set(qr.qrDotsGradientData?.rotation);
    this.qrDotsGradientColor1.set(qr.qrDotsGradientData?.colorStops[0].color);
    this.qrDotsGradientColor2.set(qr.qrDotsGradientData?.colorStops[1].color);
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
              colorStops: [
                { offset: 0, color: this.qrDotsGradientColor1() },
                { offset: 1, color: this.qrDotsGradientColor2() },
              ],
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
                type: this.qrDotsGradientType(),
                rotation: this.qrDotsGradientRotation(),
                colorStops: [
                  { offset: 0, color: this.qrDotsGradientColor1() },
                  { offset: 1, color: this.qrDotsGradientColor2() },
                ],
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
              colorStops: [
                { offset: 0, color: this.qrCornerSquareGradientColor1() },
                { offset: 1, color: this.qrCornerSquareGradientColor2() },
              ],
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
              colorStops: [
                { offset: 0, color: this.qrCornerDotGradientColor1() },
                { offset: 1, color: this.qrCornerDotGradientColor2() },
              ],
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
              colorStops: [
                { offset: 0, color: this.qrDotsGradientColor1() },
                { offset: 1, color: this.qrDotsGradientColor2() },
              ],
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
                type: this.qrDotsGradientType(),
                rotation: this.qrDotsGradientRotation(),
                colorStops: [
                  { offset: 0, color: this.qrDotsGradientColor1() },
                  { offset: 1, color: this.qrDotsGradientColor2() },
                ],
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
              colorStops: [
                { offset: 0, color: this.qrCornerSquareGradientColor1() },
                { offset: 1, color: this.qrCornerSquareGradientColor2() },
              ],
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
              colorStops: [
                { offset: 0, color: this.qrCornerDotGradientColor1() },
                { offset: 1, color: this.qrCornerDotGradientColor2() },
              ],
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
