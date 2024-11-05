import { Component, inject } from '@angular/core';
import { QrDataService } from '../../../services/qr-data.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ColorInputComponent } from '../../../components/color-input/color-input.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'qr-settings',
  standalone: true,
  imports: [ColorInputComponent, MatDividerModule, MatTabsModule],
  templateUrl: './qr-settings.component.html',
  styleUrl: './qr-settings.component.scss',
})
export class QrSettingsComponent {
  protected readonly qrDataService = inject(QrDataService);

  protected handleColorChange(color: string) {
    this.qrDataService.qrColor.set(color);
  }

  protected handleBackgroundChange(color: string) {
    this.qrDataService.qrBackground.set(color);
  }
}
