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
import {
  qrConfigStore,
  qrIconStore,
  qrStyleStore,
} from '../../store/qr-data.store';
import QRCodeStyling from 'qr-code-styling';
import { getState } from '@ngrx/signals';

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

  protected readonly qrConfigStore = inject(qrConfigStore);
  protected readonly qrIconStore = inject(qrIconStore);
  protected readonly qrStyleStore = inject(qrStyleStore);
  qr: QRCodeStyling | undefined;
  qrType = signal<QrType>('default');

  private qrTextarea =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('qrTextarea');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];

  async ngAfterViewInit(): Promise<void> {
    this.intQr();
    const lastSession = await this.storageService.restoreLastSession();
    const url = await this.getCurrentTabUrl();
    if (lastSession && lastSession.config.value) {
      this.qrConfigStore.patchFromHistory(lastSession);
      this.qrIconStore.patchFromHistory(lastSession);
      this.qrStyleStore.patchFromHistory(lastSession);
    } else {
      this.qrConfigStore.update({ value: url });
    }
    this.paint$;
    this.qrTextarea().nativeElement.select();
    this.saveSession$.pipe(debounceTime(1000)).subscribe(() => {
      this.storageService.saveSession({
        createdAt: new Date().toISOString(),
        config: getState(this.qrConfigStore),
        icon: getState(this.qrIconStore),
        style: getState(this.qrStyleStore),
      });
    });
  }

  intQr() {
    this.qr = this.qrDataService.buildQr();
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

    this.qrDataService.updateQr(this.qr);
    console.log(this.qr);
  }

  downloadQR() {
    this.qr?.download({
      name: `${this.qrConfigStore.value()}`,
      extension: `${this.qrConfigStore.downloadType()}`,
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
      canvas: document.querySelector('canvas')?.toDataURL('image/png'),
      config: getState(this.qrConfigStore),
      icon: getState(this.qrIconStore),
      style: getState(this.qrStyleStore),
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

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.qrIconStore.update({
        src: base64String,
        size: 0.5,
        name: file.name,
      });
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
    img.src = this.qrIconStore.src();
    img.onload = () => {
      ctx.drawImage(
        img,
        (canvas.width - this.qrIconStore.size()) / 2,
        (canvas.height - this.qrIconStore.size()) / 2,
        this.qrIconStore.size(),
        this.qrIconStore.size()
      );
    };
    img.onerror = (error) => {
      throw console.error('Error loading image:', error);
    };
  }

  resetIcon() {
    this.qrIconStore.reset();
  }

  protected async resetQr() {
    const url = await this.getCurrentTabUrl();
    this.qrDataService.resetQr();
    this.qrConfigStore.update({ value: url });
  }

  private getCurrentTabUrl(): Promise<string> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]?.url || '');
      });
    });
  }
}
