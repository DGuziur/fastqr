import { Component, inject, output } from '@angular/core';
import { QrDataService } from '../../../services/qr-data.service';
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

    this.qrDataService.qrIconName.set(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.qrDataService.qrIcon.set(base64String);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
    this.imageChanged.emit();
  }

  resetIcon() {
    this.qrDataService.qrIcon.set('');
    this.qrDataService.qrIconName.set('');
  }

  protected toggleTransparent() {
    this.qrDataService.qrTransparent.update((value) => !value);
  }

  protected handleCornerSquareChange(color: string) {
    this.qrDataService.qrCornerSquare.set(color);
  }

  protected handleCornerDotChange(color: string) {
    this.qrDataService.qrCornerDot.set(color);
  }

  protected handleColorChange(color: string) {
    this.qrDataService.qrColor.set(color);
  }

  protected handleBackgroundChange(color: string) {
    this.qrDataService.qrBackground.set(color);
  }

  handleDotsGradient(value: ColorStops) {
    this.qrDataService.qrDotsColorStops.set(value);
  }

  handleBackgroundGradient(value: ColorStops) {
    this.qrDataService.qrBackgroundColorStops.set(value);
  }

  handleCornerSquareGradient(value: ColorStops) {
    this.qrDataService.qrCornerSquareColorStops.set(value);
  }
}
