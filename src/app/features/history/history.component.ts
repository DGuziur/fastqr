import { Component, effect, inject, output, viewChild } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EmptyListComponent } from '../../components/empty-list/empty-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QrDataService } from '../../services/qr-data.service';

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
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    EmptyListComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  readonly editElement = output<HistoryItem>();

  private readonly storageService = inject(StorageService);
  private readonly table = viewChild.required<MatTable<HistoryItem>>('table');
  private readonly paginator = viewChild.required<MatPaginator>('paginator');

  protected readonly qrService = inject(QrDataService);
  protected dataSource = new MatTableDataSource<HistoryItem>(
    this.storageService.history()
  );

  dataSource$ = effect(() => {
    this.dataSource = new MatTableDataSource<HistoryItem>(
      this.storageService.history()
    );
    this.dataSource.paginator = this.paginator();
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

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async editItemFromHistory(createdAt: string) {
    const item = await this.storageService.getQrByDate(createdAt);
    if (item) {
      this.editElement.emit(item);
    }
  }
}
