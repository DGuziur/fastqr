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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilesService } from '../../../services/files.service';
import { PhoneContactFormComponent } from '../../../components/phone-contact-form/phone-contact-form.component';
import { WifiConnectFormComponent } from '../../../components/wifi-connect-form/wifi-connect-form.component';

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
    MatTooltipModule,
    MatSlideToggleModule,
    MatExpansionModule,
    GradientInputComponent,
    PhoneContactFormComponent,
    WifiConnectFormComponent,
  ],
  templateUrl: './qr-settings.component.html',
  styleUrl: './qr-settings.component.scss',
})
export class QrSettingsComponent {
  protected readonly qrDataService = inject(QrDataService);
  protected readonly qrStyleStore = inject(qrStyleStore);
  protected readonly qrIconStore = inject(qrIconStore);
  protected readonly qrConfigStore = inject(qrConfigStore);
  protected readonly filesService = inject(FilesService);
}
