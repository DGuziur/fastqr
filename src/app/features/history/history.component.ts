import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

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
  imports: [DatePipe, MatTableModule],
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

  dataSource = new MatTableDataSource<HistoryItem>(this.mockHistory);
}
