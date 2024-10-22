import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SegmentedComponent } from '../../components/segmented/segmented.component';
import { MatIconModule } from '@angular/material/icon';

import QrCode from 'qrcode';

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
  private download =
    viewChild.required<ElementRef<HTMLAnchorElement>>('download');
  private qrTextarea =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('qrTextarea');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];

  qrValue = signal(window.location.host);
  qrBackground = signal('#fff');
  qrColor = signal('#000');
  qrLevel = signal<ErrorCodeLevel>('L');
  qrIcon = signal('');
  qrIconName = signal('');

  isCurrentlyCopied = signal(false);

  ngAfterViewInit(): void {
    this.qrTextarea().nativeElement.select();
  }

  paint = effect(() => {
    this.paintQR();
  });

  paintQR(): void {
    QrCode.toCanvas(this.canvas().nativeElement, this.qrValue(), {
      width: 200,
      color: { light: this.qrBackground(), dark: this.qrColor() },
      errorCorrectionLevel: this.qrLevel(),
    });
  }

  downloadQR() {
    const canvas = this.canvas().nativeElement;
    if (!canvas) throw console.error('Error while getting qr image');
    this.download().nativeElement.href = canvas.toDataURL('image/png');
    this.download().nativeElement.download = `${this.qrValue()}.png`;
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

  addImage(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      throw console.error('No file selected');
    }

    const file = target.files[0];
    const validExtensions = ['image/jpeg', 'image/png'];

    if (!validExtensions.includes(file.type)) {
      throw console.error('Invalid file type. Only JPG and PNG are accepted.');
    }

    this.qrIconName.set(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.qrIcon.set(base64String);
      this.isCurrentlyCopied.set(false);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
  }

  resetIcon() {
    this.qrIcon.set('');
    this.qrIconName.set('');
    this.isCurrentlyCopied.set(false);
  }

  protected handleColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrColor.set(target.value);
    this.isCurrentlyCopied.set(false);
  }

  protected handleBackgroundChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.qrBackground.set(target.value);
    this.isCurrentlyCopied.set(false);
  }

  protected handleTextareaChange(text: string) {
    this.qrValue.set(text);
    this.isCurrentlyCopied.set(false);
  }

  protected handleErrorCodeLevelChange(newLevel: ErrorCodeLevel) {
    this.qrLevel.set(newLevel);
    this.isCurrentlyCopied.set(false);
  }
}
