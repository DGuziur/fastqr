import { Component, viewChild } from '@angular/core';
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

type HistoryItem = {
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
  imports: [CdkDropList, CdkDrag, DatePipe, MatIconModule, MatTableModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  mockHistory: HistoryItem[] = [
    {
      createdAt: new Date(),
      qrValue: 'https://www.google.com',
      qrColor: '#000000',
      qrBackground: '#ffffff',
      qrIcon: '',
      qrIconName: '',
      qrLevel: 'L',
    },
    {
      createdAt: '2023-01-02',
      qrValue: 'https://www.google.com',
      qrColor: '#000000',
      qrBackground: '#ffffff',
      qrIcon: '',
      qrIconName: '',
      qrLevel: 'L',
    },
    {
      createdAt: '2023-01-03',
      qrValue: 'https://www.google.com',
      qrColor: '#000000',
      qrBackground: '#ffffff',
      qrIcon: '',
      qrIconName: '',
      qrLevel: 'L',
    },
  ];

  dataSource = this.mockHistory;
  table = viewChild.required<MatTable<HistoryItem>>('table');

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.findIndex(
      (d) => d === event.item.data
    );

    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    this.table().renderRows();
  }
}
