import { Component, inject, signal } from '@angular/core';
import { QrGeneratorComponent } from './features/qr-generator/qr-generator.component';
import { HistoryComponent } from './features/history/history.component';
import { HistoryItem } from './types/history-item.type';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { QrDataService } from './services/qr-data.service';
import { SupportPageComponent } from './features/support-page/support-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SettingsComponent } from './features/settings/settings.component';

@Component({
  selector: 'app-root',
  imports: [
    HistoryComponent,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    QrGeneratorComponent,
    SupportPageComponent,
    SettingsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly qrDataService = inject(QrDataService);
  title = 'fast-qr';
  tabIndex = signal<number>(0);

  handleEditFromHistory(item: HistoryItem) {
    this.tabIndex.set(0);
    this.qrDataService.editQr(item);
  }
}
