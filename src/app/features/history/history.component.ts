import { Component, effect, inject, signal, viewChild } from '@angular/core';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { QrDataService } from '../../services/qr-data.service';
import { ErrorCodeLevel } from '../qr-generator/qr-generator.component';

export type HistoryItem = {
  createdAt: Date | string;
  qrValue: string;
  qrColor: string;
  qrBackground: string;
  qrIcon: string;
  qrIconName: string;
  qrLevel: string;
  canvas?: string;
  qrTransparent?: boolean;
};

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private readonly storageService = inject(StorageService);
  private readonly table = viewChild.required<MatTable<HistoryItem>>('table');
  private readonly qrDataService = inject(QrDataService);

  protected dataSource = new MatTableDataSource<HistoryItem>(
    this.storageService.history()
  );

  dataSource$ = effect(() => {
    this.dataSource = new MatTableDataSource<HistoryItem>(
      this.storageService.history()
    );
  });

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.data.findIndex(
      (d) => d === event.item.data
    );

    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    this.table().renderRows();
  }

  clearHistory() {
    this.storageService.clearHistory();
  }

  removeByDate(date: string) {
    this.storageService.removeQrByDate(date);
  }

  async getItemFromHistory(createdAt: string) {
    const item = await this.storageService.getQrByDate(createdAt);
    if (item) {
      this.qrDataService.qrValue.set(item.qrValue);
      this.qrDataService.qrColor.set(item.qrColor);
      this.qrDataService.qrBackground.set(item.qrBackground);
      this.qrDataService.qrIcon.set(item.qrIcon);
      this.qrDataService.qrIconName.set(item.qrIconName);
      this.qrDataService.qrLevel.set(<ErrorCodeLevel>item.qrLevel);
      this.qrDataService.qrTransparent.set(item.qrTransparent || false);
    }
  }
}
