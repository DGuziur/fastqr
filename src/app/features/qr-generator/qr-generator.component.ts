import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColorPickerComponent } from 'ng-zorro-antd/color-picker';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzInputModule } from 'ng-zorro-antd/input';

type ErrorCodeLevel = 'L' | 'M' | 'Q' | 'H';

@Component({
  selector: 'qr-generator',
  standalone: true,
  imports: [
    NzButtonModule,
    NzSegmentedModule,
    NzQRCodeModule,
    NzColorPickerComponent,
    NzInputModule,
  ],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
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
    });
  }
}
