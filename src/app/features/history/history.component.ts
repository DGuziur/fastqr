import { Component, effect, inject, viewChild } from '@angular/core';
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

export type HistoryItem = {
  createdAt: Date | string;
  qrValue: string;
  qrColor: string;
  qrBackground: string;
  qrIcon: string;
  qrIconName: string;
  qrLevel: string;
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
}
