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
import QrCode from 'qrcode';
import { StorageService } from '../../services/storage.service';
import { debounceTime, Subject } from 'rxjs';
import { QrDataService } from '../../services/qr-data.service';

export type ErrorCodeLevel = 'L' | 'M' | 'Q' | 'H';

@Component({
  selector: 'qr-generator',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SegmentedComponent],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrGeneratorComponent implements AfterViewInit {
  private readonly storageService = inject(StorageService);
  protected readonly qrDataService = inject(QrDataService);

  private download =
    viewChild.required<ElementRef<HTMLAnchorElement>>('download');
  private qrTextarea =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('qrTextarea');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];
  isCurrentlyCopied = signal(false);

  async ngAfterViewInit(): Promise<void> {
    const lastSession: any = await this.storageService.restoreLastSession();
    const url = await this.getCurrentTabUrl();
    if (lastSession && lastSession.qrValue) {
      this.qrDataService.qrValue.set(lastSession.qrValue);
      this.qrDataService.qrColor.set(lastSession.qrColor);
      this.qrDataService.qrBackground.set(lastSession.qrBackground);
      this.qrDataService.qrIcon.set(lastSession.qrIcon);
      this.qrDataService.qrIconName.set(lastSession.qrIconName);
      this.qrDataService.qrLevel.set(lastSession.qrLevel);
      this.qrDataService.qrTransparent.set(lastSession.qrTransparent);
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
        qrIcon: this.qrDataService.qrIcon(),
        qrIconName: this.qrDataService.qrIconName(),
        qrLevel: this.qrDataService.qrLevel(),
        qrTransparent: this.qrDataService.qrTransparent(),
      });
    });
  }

  private readonly paint$ = effect(() => {
    this.paintQR();
    this.saveSession$.next();
  });

  private readonly saveSession$ = new Subject<void>();

  paintQR(): void {
    const transparentString = this.qrDataService.qrTransparent() ? '00' : 'ff';
    QrCode.toCanvas(this.canvas().nativeElement, this.qrDataService.qrValue(), {
      width: 200,
      color: {
        light: `${this.qrDataService.qrBackground()}${transparentString}`,
        dark: this.qrDataService.qrColor(),
      },
      errorCorrectionLevel: this.qrDataService.qrLevel(),
    });

    if (this.qrDataService.qrIcon()) {
      this.placeImg();
    }
  }

  downloadQR() {
    const canvas = this.canvas().nativeElement;
    if (!canvas) throw console.error('Error while getting qr image');
    this.download().nativeElement.href = canvas.toDataURL('image/png');
    this.download().nativeElement.download = `${this.qrDataService.qrValue()}.png`;
    this.download().nativeElement.dispatchEvent(new MouseEvent('click'));
  }

  copyToClipboard() {
    const canvas = this.canvas().nativeElement;
    if (!canvas) throw console.error('Error while getting qr image');
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) throw console.error('Error while converting qr image to blob');
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      this.isCurrentlyCopied.set(true);
    });
  }

  saveQR() {
    this.storageService.saveQr({
      createdAt: new Date().toISOString(),
      qrValue: this.qrDataService.qrValue(),
      qrColor: this.qrDataService.qrColor(),
      qrBackground: this.qrDataService.qrBackground(),
      qrIcon: this.qrDataService.qrIcon(),
      qrIconName: this.qrDataService.qrIconName(),
      qrLevel: this.qrDataService.qrLevel(),
      canvas: this.canvas().nativeElement.toDataURL('image/png'),
      qrTransparent: this.qrDataService.qrTransparent(),
    });
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
      this.isCurrentlyCopied.set(false);
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
    this.isCurrentlyCopied.set(false);
  }

  protected handleColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrDataService.qrColor.set(target.value);
    this.isCurrentlyCopied.set(false);
  }

  protected handleBackgroundChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrDataService.qrBackground.set(target.value);
    this.isCurrentlyCopied.set(false);
  }

  protected handleTextareaChange(text: string) {
    this.qrDataService.qrValue.set(text);
    this.isCurrentlyCopied.set(false);
  }

  protected handleErrorCodeLevelChange(newLevel: ErrorCodeLevel) {
    this.qrDataService.qrLevel.set(newLevel);
    this.isCurrentlyCopied.set(false);
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
