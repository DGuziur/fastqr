import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'qr-generator',
  standalone: true,
  imports: [NzButtonModule, NzQRCodeModule],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
})
export class QrGeneratorComponent {
  private qr = viewChild.required<ElementRef>('qr');
  private download = viewChild.required<ElementRef>('download');
  qrValue = signal(window.location.href);

  downloadQR() {
    const canvas = this.qr().nativeElement.querySelector('canvas');
    if (!canvas) console.error('Error while getting qr image');
    this.download().nativeElement.href = canvas.toDataURL('image/png');
    this.download().nativeElement.download = `${this.qrValue()}.png`;
    this.download().nativeElement.dispatchEvent(new MouseEvent('click'));
  }
}
