import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import { HistoryItem } from '../features/history/history.component';
import { SnackbarService } from './snackbar.service';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
  GradientType,
  Options,
} from 'qr-code-styling';
import { ColorStops } from '../components/gradient-input/gradient-input.component';
import {
  qrStyleStore,
  qrIconStore,
  qrConfigStore,
} from '../store/qr-data.store';

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
  private readonly styleStore = inject(qrStyleStore);
  private readonly iconStore = inject(qrIconStore);
  private readonly configStore = inject(qrConfigStore);

  qrState = computed<Options>(() => {
    return {
      width: 200,
      height: 200,
      data: this.configStore.value(),
      image: this.iconStore.src(),
      margin: this.configStore.margin(),
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: this.configStore.level(),
      },
      imageOptions: {
        hideBackgroundDots: this.iconStore.hideBackgroundDots(),
        imageSize: this.iconStore.size(),
        margin: this.iconStore.margin(),
        crossOrigin: 'anonymous',
      },
      dotsOptions: this.styleStore.dots.gradient.enabled()
        ? {
            type: this.styleStore.dots.type(),
            gradient: {
              type: this.styleStore.dots.gradient.type(),
              rotation: this.styleStore.dots.gradient.rotation(),
              colorStops: this.styleStore.dots.gradient.colorStops(),
            },
          }
        : {
            gradient: undefined,
            color: this.styleStore.dots.color(),
            type: this.styleStore.dots.type(),
          },
      backgroundOptions:
        this.styleStore.background.gradient.enabled() &&
        !this.styleStore.background.isTransparent()
          ? {
              gradient: {
                type: this.styleStore.background.gradient.type(),
                rotation: this.styleStore.background.gradient.rotation(),
                colorStops: this.styleStore.background.gradient.colorStops(),
              },
            }
          : {
              gradient: undefined,
              color: this.styleStore.background.isTransparent()
                ? 'transparent'
                : this.styleStore.background.color(),
            },
      cornersSquareOptions: this.styleStore.square.gradient.enabled()
        ? {
            type: this.styleStore.square.type(),
            gradient: {
              type: this.styleStore.square.gradient.type(),
              rotation: this.styleStore.square.gradient.rotation(),
              colorStops: this.styleStore.square.gradient.colorStops(),
            },
          }
        : {
            gradient: undefined,
            type: this.styleStore.square.type(),
            color: this.styleStore.square.color(),
          },
      cornersDotOptions: this.styleStore.cornerDot.gradient.enabled()
        ? {
            type: this.styleStore.cornerDot.type(),
            gradient: {
              type: this.styleStore.cornerDot.gradient.type(),
              rotation: this.styleStore.cornerDot.gradient.rotation(),
              colorStops: this.styleStore.cornerDot.gradient.colorStops(),
            },
          }
        : {
            gradient: undefined,
            color: this.styleStore.cornerDot.color(),
            type: this.styleStore.cornerDot.type(),
          },
    };
  });

  test = effect(() => {
    console.log(this.qrState());
  });

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
    this.configStore.reset();
    this.iconStore.reset();
    this.styleStore.reset();
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
    return new QRCodeStyling(this.qrState());
  }

  updateQr(qr: QRCodeStyling) {
    qr.update(this.qrState());
  }
}

export const DEFAULT_COLOR_STOPS: ColorStops = [
  { offset: 0, color: '#ffffff' },
  { offset: 1, color: '#77779C' },
];
