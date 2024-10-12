import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColor, NzColorPickerComponent } from 'ng-zorro-antd/color-picker';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

type ErrorCodeLevel = 'L' | 'M' | 'Q' | 'H';
type ColorEvent = { color: NzColor; format: string };

@Component({
  selector: 'qr-generator',
  standalone: true,
  imports: [
    NzButtonModule,
    NzSegmentedModule,
    NzQRCodeModule,
    NzColorPickerComponent,
    NzIconModule,
    NzInputModule,
    NzToolTipModule,
  ],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrGeneratorComponent implements AfterViewInit {
  private qr = viewChild.required<ElementRef<HTMLDivElement>>('qr');
  private download =
    viewChild.required<ElementRef<HTMLAnchorElement>>('download');
  private qrTextarea =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('qrTextarea');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];

  qrValue = signal(window.location.href);
  qrColor = signal('rgb(0, 0, 0)');
  qrLevel = signal<ErrorCodeLevel>('L');
  qrIcon = signal('');
  qrIconName = signal('');

  isCurrentlyCopied = signal(false);

  ngAfterViewInit(): void {
    this.qrTextarea().nativeElement.select();
  }

  downloadQR() {
    const canvas = this.qr().nativeElement.querySelector('canvas');
    if (!canvas) throw console.error('Error while getting qr image');
    this.download().nativeElement.href = canvas.toDataURL('image/png');
    this.download().nativeElement.download = `${this.qrValue()}.png`;
    this.download().nativeElement.dispatchEvent(new MouseEvent('click'));
  }

  copyToClipboard() {
    const canvas = this.qr().nativeElement.querySelector('canvas');
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

  protected handleColorChange(e: ColorEvent) {
    this.qrColor.set(e.color.toRgbString());
    this.isCurrentlyCopied.set(false);
  }

  protected handleTextareaChange(text: string) {
    this.qrValue.set(text);
    this.isCurrentlyCopied.set(false);
  }

  protected handleErrorCodeLevelChange(index: number) {
    this.qrLevel.set(this.errorCodeLevels[index]);
    this.isCurrentlyCopied.set(false);
  }
}
