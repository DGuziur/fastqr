import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import QrCode from 'qrcode';
import { ErrorCodeLevel } from '../../features/qr-generator/qr-generator.component';

@Component({
  selector: 'qr-component',
  standalone: true,
  imports: [],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss',
})
export class QrcodeComponent {
  color = input<string>('#000');
  value = input<string>(window.location.href);
  level = input<ErrorCodeLevel>('L');
  icon = input<string | null>(null);
  size = input<number>(200);

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  paint = effect(() => {
    this.paintQR();
  });

  paintQR(): void {
    QrCode.toCanvas(this.canvas().nativeElement, this.value(), {
      width: this.size(),
      color: { light: '#fff', dark: this.color() },
      errorCorrectionLevel: this.level(),
    });
  }
}
