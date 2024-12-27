import { computed, inject, Injectable } from '@angular/core';
import { HistoryItem } from '../types/history-item.type';
import { SnackbarService } from './snackbar.service';
import QRCodeStyling, { Options } from 'qr-code-styling';
import {
  qrStyleStore,
  qrIconStore,
  qrConfigStore,
} from '../store/qr-data.store';

@Injectable({
  providedIn: 'root',
})
export class QrDataService {
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

  resetQr() {
    this.configStore.reset();
    this.iconStore.reset();
    this.styleStore.reset();
  }

  editQr(qr: HistoryItem) {
    this.configStore.patchFromHistory(qr);
    this.styleStore.patchFromHistory(qr);
    this.iconStore.patchFromHistory(qr);
  }

  downloadQr(qr: HistoryItem) {
    if (!qr.canvas) throw new Error('Nothing to download');
    const qrCanvas = this.buildQr(qr);
    qrCanvas.download({
      name: qr.config.value,
      extension: qr.config.downloadType,
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
    if (!qr.config.value) throw new Error('Nothing to go to');
    chrome.tabs.create({ url: qr.config.value, active: false });
  }

  buildQr(qr?: HistoryItem) {
    return new QRCodeStyling(this.qrState());
  }

  updateQr(qr: QRCodeStyling) {
    qr.update(this.qrState());
  }
}
