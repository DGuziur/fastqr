import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';
import { SnackbarService } from './snackbar.service';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
  GradientType,
} from 'qr-code-styling';
import { ColorStops } from '../components/gradient-input/gradient-input.component';

export const DEFAULT_COLOR_STOPS: ColorStops = [
  { offset: 0, color: '#ffffff' },
  { offset: 1, color: '#77779C' },
];

export type QrGradient = {
  type: GradientType;
  rotation: number;
  colorStops: ColorStops;
};

type QrBackground = {
  color: string;
  type: DotType;
  transparent: boolean;
  isGradient: boolean;
  gradient: QrGradient;
};

export type QrColorOptions = {
  color: string;
  isGradient: boolean;
  gradient: QrGradient;
};

type QrMainDots = {
  color: string;
  type: DotType;
  isGradient: boolean;
  gradient: QrGradient;
};

type QrCornersSquare = {
  color: string;
  type: CornerSquareType;
  isGradient: boolean;
  gradient: QrGradient;
};

type QrCornersDot = {
  color: string;
  type: CornerDotType;
  isGradient: boolean;
  gradient: QrGradient;
};

type QrIcon = {
  hideBackgroundDots: boolean;
  name: string;
  margin: number;
  size: number;
  src: string;
};

type QrState = {
  value: string;
  level: ErrorCodeLevel;
  margin: number;
  downloadType: FileExtension;
  mainDots: QrMainDots;
  background: QrBackground;
  cornerSquare: QrCornersSquare;
  cornerDot: QrCornersDot;
  icon: QrIcon;
};

export type HistoryItem = {
  createdAt: Date | string;
  canvas?: string;
  value: string;
  level: ErrorCodeLevel;
  downloadType: FileExtension;
  margin: number;
  mainDots: QrMainDots;
  background: QrBackground;
  cornerSquare: QrCornersSquare;
  cornerDot: QrCornersDot;
  icon: QrIcon;
};

@Injectable({
  providedIn: 'root',
})
export class QrDataService {
  private readonly snackbar = inject(SnackbarService);

  public currentState: Signal<QrState>;
  private initialState: QrState;
  private resetState: Function;
  constructor() {
    const { initialState, currentState, resetState } = this.createState();
    this.initialState = initialState;
    this.currentState = currentState;
    this.resetState = resetState;
  }

  public value = signal<string>('');
  public level = signal<ErrorCodeLevel>('L');
  public margin = signal<number>(4);
  public downloadType = signal<FileExtension>('png');

  public mainDots = signal<QrMainDots>({
    color: '#000000',
    type: 'square',
    isGradient: false,
    gradient: {
      type: 'linear',
      rotation: 0,
      colorStops: DEFAULT_COLOR_STOPS,
    },
  });

  public background = signal<QrBackground>({
    color: '#ffffff',
    type: 'square',
    transparent: false,
    isGradient: false,
    gradient: {
      type: 'linear',
      rotation: 0,
      colorStops: DEFAULT_COLOR_STOPS,
    },
  });

  public cornerSquare = signal<QrCornersSquare>({
    color: '#000000',
    type: 'square',
    isGradient: false,
    gradient: {
      type: 'linear',
      rotation: 0,
      colorStops: DEFAULT_COLOR_STOPS,
    },
  });

  public cornerDot = signal<QrCornersDot>({
    color: '#000000',
    type: 'dot',
    isGradient: false,
    gradient: {
      type: 'linear',
      rotation: 0,
      colorStops: DEFAULT_COLOR_STOPS,
    },
  });

  public icon = signal<QrIcon>({
    src: '',
    hideBackgroundDots: false,
    name: '',
    margin: 0,
    size: 0.5,
  });

  private readonly createState = () => {
    const c = computed(() => {
      return {
        value: this.value(),
        level: this.level(),
        margin: this.margin(),
        downloadType: this.downloadType(),
        mainDots: this.mainDots(),
        background: this.background(),
        cornerSquare: this.cornerSquare(),
        cornerDot: this.cornerDot(),
        icon: this.icon(),
      };
    });
    const initialState = c();
    return {
      initialState,
      currentState: c,
      resetState: () => {
        this.value.set(initialState.value);
        this.level.set(initialState.level);
        this.margin.set(initialState.margin);
        this.downloadType.set(initialState.downloadType);
        this.mainDots.set(initialState.mainDots);
        this.background.set(initialState.background);
        this.cornerSquare.set(initialState.cornerSquare);
        this.cornerDot.set(initialState.cornerDot);
        this.icon.set(initialState.icon);
      },
    };
  };

  resetQr() {
    this.resetState();
  }

  editQr(qr: HistoryItem) {
    this.value.set(qr.value);
    this.level.set(qr.level);
    this.margin.set(qr.margin);
    this.mainDots.set(qr.mainDots);
    this.background.set(qr.background);
    this.cornerSquare.set(qr.cornerSquare);
    this.cornerDot.set(qr.cornerDot);
    this.icon.set(qr.icon);
  }

  downloadQr(qr: HistoryItem) {
    if (!qr.canvas) throw new Error('Nothing to download');
    const qrCanvas = this.buildQr(qr);
    qrCanvas.download({
      name: qr.value,
      extension: qr.downloadType,
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
    if (!qr.value) throw new Error('Nothing to go to');
    chrome.tabs.create({ url: qr.value, active: false });
  }

  buildQr(state: QrState): QRCodeStyling {
    return new QRCodeStyling({
      width: 200,
      height: 200,
      data: state.value, // QR code content
      image: state.icon.src,
      margin: state.margin, // QR margin
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: state.level, // Error correction level
      },
      imageOptions: {
        hideBackgroundDots: state.icon.hideBackgroundDots, // Hide dots behind the icon
        imageSize: state.icon.size, // Icon size
        margin: state.icon.margin, // Icon margin
        crossOrigin: 'anonymous',
      },
      dotsOptions: state.mainDots.isGradient
        ? {
            type: state.mainDots.type, // Dot type
            gradient: state.mainDots.gradient,
          }
        : {
            color: state.mainDots.color,
            type: state.mainDots.type,
          },
      backgroundOptions:
        state.background.isGradient && !state.background.transparent
          ? {
              gradient: state.background.gradient,
            }
          : {
              color: state.background.transparent
                ? 'transparent'
                : state.background.color,
            },
      cornersSquareOptions: state.cornerSquare.isGradient
        ? {
            type: state.cornerSquare.type,
            gradient: state.cornerSquare.gradient,
          }
        : {
            color: state.cornerSquare.color,
            type: state.cornerSquare.type,
          },
      cornersDotOptions: state.cornerDot.isGradient
        ? {
            type: state.cornerDot.type,
            gradient: state.cornerDot.gradient,
          }
        : {
            color: state.cornerDot.color,
            type: state.cornerDot.type,
          },
    });
  }

  updateQr(qr: QRCodeStyling, state: QrState) {
    qr.update({
      width: 200,
      height: 200,
      data: state.value, // QR code content
      image: state.icon.src, // Image or icon for the QR code
      margin: state.margin, // QR margin
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: state.level, // Error correction level
      },
      imageOptions: {
        hideBackgroundDots: state.icon.hideBackgroundDots, // Hide dots behind the icon
        imageSize: state.icon.size, // Icon size
        margin: state.icon.margin, // Icon margin
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: state.mainDots.type, // Dot type
        color: state.mainDots.color,
        gradient: state.mainDots.isGradient
          ? state.mainDots.gradient
          : undefined,
      },
      backgroundOptions: {
        color: state.background.transparent
          ? 'transparent'
          : state.background.color,
        gradient: state.background.isGradient
          ? state.background.gradient
          : undefined,
      },
      cornersSquareOptions: {
        type: state.cornerSquare.type,
        color: state.cornerSquare.color,
        gradient: state.cornerSquare.isGradient
          ? state.cornerSquare.gradient
          : undefined,
      },
      cornersDotOptions: {
        type: state.cornerDot.type,
        color: state.cornerDot.color,
        gradient: state.cornerDot.isGradient
          ? state.cornerDot.gradient
          : undefined,
      },
    });
  }
}
