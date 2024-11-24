import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SegmentedComponent } from '../../components/segmented/segmented.component';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { debounceTime, Subject } from 'rxjs';
import { QrDataService } from '../../services/qr-data.service';
import { MatCardModule } from '@angular/material/card';
import { QrSettingsComponent } from '../qr-settings/qr-settings/qr-settings.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarService } from '../../services/snackbar.service';

export type ErrorCodeLevel = 'L' | 'M' | 'Q' | 'H';

@Component({
  selector: 'qr-generator',
  imports: [
    MatButtonModule,
    MatCardModule,
    QrSettingsComponent,
    MatIconModule,
    MatTooltipModule,
    SegmentedComponent,
  ],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrGeneratorComponent implements AfterViewInit {
  private readonly storageService = inject(StorageService);
  private readonly snackbar = inject(SnackbarService);
  protected readonly qrDataService = inject(QrDataService);
  qr: any = null;

  private download =
    viewChild.required<ElementRef<HTMLAnchorElement>>('download');
  private qrTextarea =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('qrTextarea');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];

  async ngAfterViewInit(): Promise<void> {
    this.intQr();
    const lastSession: any = await this.storageService.restoreLastSession();
    const url = await this.getCurrentTabUrl();
    if (lastSession && lastSession.qrValue) {
      this.qrDataService.qrValue.set(lastSession.qrValue);
      this.qrDataService.qrColor.set(lastSession.qrColor);
      this.qrDataService.qrBackground.set(lastSession.qrBackground);
      this.qrDataService.qrIcon.set(lastSession.qrIcon);
      this.qrDataService.qrIconName.set(lastSession.qrIconName);
      this.qrDataService.qrIconSize.set(lastSession.qrIconSize);
      this.qrDataService.qrLevel.set(lastSession.qrLevel);
      this.qrDataService.qrTransparent.set(lastSession.qrTransparent);
      this.qrDataService.qrMargin.set(lastSession.qrMargin);
      this.qrDataService.qrCornerSquare.set(lastSession.qrCornerSquare);
      this.qrDataService.qrCornerDot.set(lastSession.qrCornerDot);
      this.qrDataService.qrCornerDotType.set(lastSession.qrCornerDotType);
      this.qrDataService.qrSquareType.set(lastSession.qrSquareType);
      this.qrDataService.qrDotsType.set(lastSession.qrDotsType);
      this.qrDataService.qrIconMargin.set(lastSession.qrIconMargin);
      this.qrDataService.qrIconHideBackgroundDots.set(
        lastSession.qrIconHideBackgroundDots
      );
    } else {
      this.qrDataService.qrValue.set(url);
    }
    this.paint$;
    this.qrTextarea().nativeElement.select();
    this.saveSession$.pipe(debounceTime(1000)).subscribe(() => {
      this.storageService.saveSession({
        createdAt: new Date().toISOString(),
        qrValue: this.qrDataService.qrValue(),
        qrColor: this.qrDataService.qrColor(),
        qrBackground: this.qrDataService.qrBackground(),
        qrCornerSquare: this.qrDataService.qrCornerSquare(),
        qrCornerDot: this.qrDataService.qrCornerDot(),
        qrIcon: this.qrDataService.qrIcon(),
        qrIconName: this.qrDataService.qrIconName(),
        qrIconSize: this.qrDataService.qrIconSize(),
        qrLevel: this.qrDataService.qrLevel(),
        qrTransparent: this.qrDataService.qrTransparent(),
        qrMargin: this.qrDataService.qrMargin(),
        qrDownloadType: this.qrDataService.qrDownloadType(),
        qrCornerDotType: this.qrDataService.qrCornerDotType(),
        qrSquareType: this.qrDataService.qrSquareType(),
        qrDotsType: this.qrDataService.qrDotsType(),
        qrIconMargin: this.qrDataService.qrIconMargin(),
        qrIconHideBackgroundDots: this.qrDataService.qrIconHideBackgroundDots(),
      });
    });
  }

  intQr() {
    this.qr = this.qrDataService.buildQr();

    this.qr.append(this.canvas().nativeElement);
    console.log(this.qr);
  }

  private readonly paint$ = effect(() => {
    this.paintQR();
    this.saveSession$.next();
  });

  private readonly saveSession$ = new Subject<void>();

  paintQR(): void {
    if (!this.qr) {
      this.intQr();
      return;
    }

    while (this.canvas().nativeElement.firstChild) {
      this.canvas().nativeElement.removeChild(
        this.canvas().nativeElement.firstChild!
      );
    }

    this.qrDataService.updateQr(this.qr);
    console.log(this.qr);
  }

  downloadQR() {
    this.qr.download({
      name: `${this.qrDataService.qrValue()}`,
      extension: `${this.qrDataService.qrDownloadType()}`,
    });
  }

  copyToClipboard() {
    const canvas = document.querySelector('canvas');
    if (!canvas) throw console.error('Error while getting qr image');
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) throw console.error('Error while converting qr image to blob');
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    });
    this.snackbar.open('Copied to clipboard');
  }

  saveQR() {
    this.storageService.saveQr({
      createdAt: new Date().toLocaleString(),
      qrValue: this.qrDataService.qrValue(),
      qrColor: this.qrDataService.qrColor(),
      qrBackground: this.qrDataService.qrBackground(),
      qrCornerSquare: this.qrDataService.qrCornerSquare(),
      qrCornerDot: this.qrDataService.qrCornerDot(),
      qrIcon: this.qrDataService.qrIcon(),
      qrIconName: this.qrDataService.qrIconName(),
      qrIconSize: this.qrDataService.qrIconSize(),
      qrLevel: this.qrDataService.qrLevel(),
      canvas: document.querySelector('canvas')?.toDataURL('image/png'),
      qrTransparent: this.qrDataService.qrTransparent(),
      qrMargin: this.qrDataService.qrMargin(),
      qrDownloadType: this.qrDataService.qrDownloadType(),
      qrCornerDotType: this.qrDataService.qrCornerDotType(),
      qrSquareType: this.qrDataService.qrSquareType(),
      qrDotsType: this.qrDataService.qrDotsType(),
      qrIconMargin: this.qrDataService.qrIconMargin(),
      qrIconHideBackgroundDots: this.qrDataService.qrIconHideBackgroundDots(),
    });
    this.snackbar.open('Saved');
  }

  addImage(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      throw console.error('No file selected');
    }

    const file = target.files[0];
    const validExtensions = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'application/pdf',
    ];

    if (!validExtensions.includes(file.type)) {
      throw console.error('Invalid file type. Only JPG and PNG are accepted.');
    }

    this.qrDataService.qrIconName.set(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.qrDataService.qrIcon.set(base64String);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
    this.placeImg();
  }

  placeImg() {
    const canvas = this.canvas().nativeElement;
    if (!canvas) throw console.error('Error while getting qr image');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw console.error('Error while getting canvas context');

    const img = new Image();
    img.src = this.qrDataService.qrIcon();
    img.onload = () => {
      ctx.drawImage(
        img,
        (canvas.width - this.qrDataService.qrIconSize()) / 2,
        (canvas.height - this.qrDataService.qrIconSize()) / 2,
        this.qrDataService.qrIconSize(),
        this.qrDataService.qrIconSize()
      );
    };
    img.onerror = (error) => {
      throw console.error('Error loading image:', error);
    };
  }

  resetIcon() {
    this.qrDataService.qrIcon.set('');
    this.qrDataService.qrIconName.set('');
  }

  protected async resetQr() {
    const url = await this.getCurrentTabUrl();
    this.qrDataService.resetQr();
    this.qrDataService.qrValue.set(url);
  }

  protected handleColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrDataService.qrColor.set(target.value);
  }

  protected handleBackgroundChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrDataService.qrBackground.set(target.value);
  }

  protected handleTextareaChange(text: string) {
    this.qrDataService.qrValue.set(text);
  }

  protected handleErrorCodeLevelChange(newLevel: ErrorCodeLevel) {
    this.qrDataService.qrLevel.set(newLevel);
  }

  handleToggleTransparency(): void {
    this.qrDataService.qrTransparent.update((value: boolean) => !value);
  }

  private getCurrentTabUrl(): Promise<string> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]?.url || '');
      });
    });
  }
}
