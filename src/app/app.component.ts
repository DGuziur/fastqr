import { Component, inject, signal } from '@angular/core';
import { QrGeneratorComponent } from './features/qr-generator/qr-generator.component';
import { HistoryComponent } from './features/history/history.component';
import { HistoryItem } from './store/qr-data.store';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { QrDataService } from './services/qr-data.service';
import { SupportPageComponent } from './features/support-page/support-page.component';

@Component({
  selector: 'app-root',
  imports: [
    HistoryComponent,
    MatIconModule,
    MatTabsModule,
    QrGeneratorComponent,
    SupportPageComponent,
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
