import { Injectable, signal } from '@angular/core';
import { GradientType } from 'qr-code-styling';
import { ColorStops } from '../components/gradient-input/gradient-input.component';
import { DEFAULT_COLOR_STOPS } from './qr-data.service';

@Injectable({ providedIn: 'root' })
export class QrStyleService {
  qrDotsColor = signal('#000000');
  qrDotsGradient = signal<boolean>(true);
  qrDotsGradientType = signal<GradientType>('linear');
  qrDotsGradientRotation = signal<number>(0);
  qrDotsColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);

  qrBackground = signal('#ffffff');
  qrBackgroundGradient = signal<boolean>(true);
  qrBackgroundGradientType = signal<GradientType>('linear');
  qrBackgroundGradientRotation = signal<number>(0);
  qrBackgroundColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);

  qrCornerSquare = signal('#000000');
  qrCornerSquareGradient = signal<boolean>(true);
  qrCornerSquareGradientType = signal<GradientType>('linear');
  qrCornerSquareGradientRotation = signal<number>(0);
  qrCornerSquareColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);

  qrCornerDot = signal('#000000');
  qrCornerDotGradient = signal<boolean>(true);
  qrCornerDotGradientType = signal<GradientType>('linear');
  qrCornerDotGradientRotation = signal<number>(0);
  qrCornerDotColorStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);
}
