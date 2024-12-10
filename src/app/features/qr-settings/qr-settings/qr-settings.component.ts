import { Component, inject, output, WritableSignal } from '@angular/core';
import {
  QrColorOptions,
  QrDataService,
  QrGradient,
} from '../../../services/qr-data.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ColorInputComponent } from '../../../components/color-input/color-input.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  ColorStops,
  GradientInputComponent,
} from '../../../components/gradient-input/gradient-input.component';
import { SignalUtils } from '../../../utils/signal-utils';

@Component({
  selector: 'qr-settings',
  imports: [
    ColorInputComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    GradientInputComponent,
  ],
  templateUrl: './qr-settings.component.html',
  styleUrl: './qr-settings.component.scss',
})
export class QrSettingsComponent {
  protected readonly qrDataService = inject(QrDataService);
  protected readonly patchSignal = inject(SignalUtils);
  imageChanged = output();

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
      this.qrDataService.icon.update((val) => ({
        ...val,
        name: file.name,
        src: base64String,
      }));
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
    this.imageChanged.emit();
  }

  resetIcon() {
    this.qrDataService.icon.update((val) => ({
      ...val,
      name: '',
      src: '',
    }));
  }

  protected toggleTransparent() {
    this.qrDataService.background.update((val) => ({
      ...val,
      transparent: !val.transparent,
    }));
  }

  protected handleCornerSquareChange(color: string) {
    this.qrDataService.cornerSquare.update((val) => ({
      ...val,
      color: color,
    }));
  }

  protected updateSignalProperty(
    signal: WritableSignal<any>,
    property: string,
    value: any
  ) {
    signal.update((val: any) => ({ ...val, [property]: value }));
  }

  updateColorStops<T extends QrColorOptions>(
    signal: WritableSignal<T>,
    value: ColorStops
  ) {
    signal.update((val: T) => ({
      ...val,
      gradient: {
        ...val.gradient,
        colorStops: value,
      },
    }));
  }

  protected handleUpdate<T>(
    service: { update: (updateFn: (val: T) => T) => void },
    updates: Partial<T>
  ) {
    service.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  protected handleCornerDotChange(color: string) {
    this.qrDataService.cornerDot.update((val) => ({
      ...val,
      color: color,
    }));
  }

  protected handleColorChange(color: string) {
    this.qrDataService.mainDots.update((val) => ({
      ...val,
      color: color,
    }));
  }

  protected handleBackgroundChange(color: string) {
    this.qrDataService.background.update((val) => ({
      ...val,
      color: color,
    }));
  }

  handleDotsGradient(value: ColorStops) {
    this.qrDataService.mainDots.update((val) => ({
      ...val,
      gradient: {
        ...val.gradient,
        colorStops: value,
      },
    }));
  }

  handleBackgroundGradient(value: ColorStops) {
    this.qrDataService.background.update((val) => ({
      ...val,
      gradient: {
        ...val.gradient,
        colorStops: value,
      },
    }));
  }

  handleCornerSquareGradient(value: ColorStops) {
    this.qrDataService.cornerSquare.update((val) => ({
      ...val,
      gradient: {
        ...val.gradient,
        colorStops: value,
      },
    }));
  }

  handleCornerDotGradient(value: ColorStops) {
    this.qrDataService.cornerDot.update((val) => ({
      ...val,
      gradient: {
        ...val.gradient,
        colorStops: value,
      },
    }));
  }

  mainDotsGradientToggle() {
    this.qrDataService.mainDots.update((val) => ({
      ...val,
      isGradient: !val.isGradient,
    }));
  }

  backgroundGradientToggle() {
    this.qrDataService.background.update((val) => ({
      ...val,
      isGradient: !val.isGradient,
    }));
  }

  cornerSquareGradientToggle() {
    this.qrDataService.cornerSquare.update((val) => ({
      ...val,
      isGradient: !val.isGradient,
    }));
  }

  cornerDotGradientToggle() {
    this.qrDataService.cornerDot.update((val) => ({
      ...val,
      isGradient: !val.isGradient,
    }));
  }
}
