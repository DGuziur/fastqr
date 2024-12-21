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
import { GradientInputComponent } from '../../../components/gradient-input/gradient-input.component';
import {
  qrConfigStore,
  qrIconStore,
  qrStyleStore,
} from '../../../store/qr-data.store';

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
  protected readonly qrStyleStore = inject(qrStyleStore);
  protected readonly qrIconStore = inject(qrIconStore);
  protected readonly qrConfigStore = inject(qrConfigStore);
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
      this.qrIconStore.update({
        name: file.name,
        src: base64String,
        size: 0.5,
      });
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
    this.imageChanged.emit();
  }

  resetIcon() {
    this.qrIconStore.reset();
  }
}
