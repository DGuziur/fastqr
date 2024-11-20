import { Component, inject, signal } from '@angular/core';
import { QrGeneratorComponent } from './features/qr-generator/qr-generator.component';
import {
  HistoryComponent,
  HistoryItem,
} from './features/history/history.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { QrDataService } from './services/qr-data.service';

@Component({
    selector: 'app-root',
    imports: [
        HistoryComponent,
        MatIconModule,
        MatTabsModule,
        QrGeneratorComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
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
