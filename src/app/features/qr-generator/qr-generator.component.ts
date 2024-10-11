import {
  Component,
  effect,
  ElementRef,
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
export class QrGeneratorComponent {
  private qr = viewChild.required<ElementRef>('qr');
  private download = viewChild.required<ElementRef>('download');

  errorCodeLevels: ErrorCodeLevel[] = ['L', 'M', 'Q', 'H'];

  qrValue = signal(window.location.href);
  qrColor = signal('rgb(0, 0, 0)');
  qrLevel = signal<ErrorCodeLevel>('L');

  downloadQR() {
    const canvas = this.qr().nativeElement.querySelector('canvas');
    if (!canvas) console.error('Error while getting qr image');
    this.download().nativeElement.href = canvas.toDataURL('image/png');
    this.download().nativeElement.download = `${this.qrValue()}.png`;
    this.download().nativeElement.dispatchEvent(new MouseEvent('click'));
  }
}
