import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
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
import { PhoneContactFormComponent } from '../../components/phone-contact-form/phone-contact-form.component';
import { WifiConnectFormComponent } from '../../components/wifi-connect-form/wifi-connect-form.component';

export type QrType = 'default' | 'phone-contact' | 'wifi';

export type ErrorCodeLevel = 'L' | 'M' | 'Q' | 'H';

export type VCARD = {
  BEGIN: 'VCARD';
  VERSION: '3.0';
  FN: string | null;
  TEL: string | null;
  EMAIL: string | null;
  ADR: string | null;
  ORG: string | null;
  TITLE: string | null;
  URL: string | null;
  END: 'VCARD';
};

@Component({
  selector: 'qr-generator',
  imports: [
    MatButtonModule,
    MatCardModule,
    QrSettingsComponent,
    MatIconModule,
    MatTooltipModule,
    SegmentedComponent,
    PhoneContactFormComponent,
    WifiConnectFormComponent,
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
  qrType = signal<QrType>('default');

  private qrTextarea =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('qrTextarea');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];

  async ngAfterViewInit(): Promise<void> {
    this.intQr();
    const lastSession: any = await this.storageService.restoreLastSession();
    const url = await this.getCurrentTabUrl();
    if (lastSession && lastSession.value) {
      this.qrDataService.updateQr(this.qr, lastSession);
    } else {
      this.qrDataService.value.set(url);
    }
    this.paint$;
    this.qrTextarea().nativeElement.select();
    this.saveSession$.pipe(debounceTime(1000)).subscribe(() => {
      this.storageService.saveSession({
        ...this.qrDataService.currentState(),
        createdAt: new Date().toISOString(),
      });
    });
  }

  intQr() {
    this.qr = this.qrDataService.buildQr(this.qrDataService.currentState());
    this.qr.append(this.canvas().nativeElement);
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

    this.qrDataService.updateQr(this.qr, this.qrDataService.currentState());
  }

  downloadQR() {
    this.qr.download({
      name: `${this.qrDataService.value()}`,
      extension: `${this.qrDataService.downloadType()}`,
    });
  }

  phoneNumber() {}

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
      canvas: document.querySelector('canvas')?.toDataURL('image/png'),
      ...this.qrDataService.currentState(),
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

    this.qrDataService.icon.update((val) => ({
      ...val,
      name: file.name,
    }));

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.qrDataService.icon.update((val) => ({ ...val, src: base64String }));
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
    img.src = this.qrDataService.icon().src;
    img.onload = () => {
      ctx.drawImage(
        img,
        (canvas.width - this.qrDataService.icon().size) / 2,
        (canvas.height - this.qrDataService.icon().size) / 2,
        this.qrDataService.icon().size,
        this.qrDataService.icon().size
      );
    };
    img.onerror = (error) => {
      throw console.error('Error loading image:', error);
    };
  }

  resetIcon() {
    this.qrDataService.icon.update((val) => ({
      ...val,
      name: '',
      src: '',
    }));
  }

  protected async resetQr() {
    const url = await this.getCurrentTabUrl();
    this.qrDataService.resetQr();
    this.qrDataService.value.set(url);
  }

  protected handleColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrDataService.mainDots.update((val) => ({
      ...val,
      color: target.value,
    }));
  }

  protected handleBackgroundChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrDataService.background.update((val) => ({
      ...val,
      color: target.value,
    }));
  }

  protected handleTextareaChange(text: string) {
    this.qrDataService.value.set(text);
  }

  protected handleErrorCodeLevelChange(newLevel: ErrorCodeLevel) {
    this.qrDataService.level.set(newLevel);
  }

  handleToggleTransparency(): void {
    this.qrDataService.background.update((val) => ({
      ...val,
      transparent: !val.transparent,
    }));
  }

  private getCurrentTabUrl(): Promise<string> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]?.url || '');
      });
    });
  }
}
