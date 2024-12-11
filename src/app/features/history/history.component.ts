import { Component, effect, inject, output, viewChild } from '@angular/core';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { EmptyListComponent } from '../../components/empty-list/empty-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QrDataService } from '../../services/qr-data.service';
import { UserSettingsService } from '../../services/userSettings.service';
import {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
} from 'qr-code-styling';

export type GradientData = {
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: {
    offset: number;
    color: string;
  }[];
};

export type HistoryItem = {
  createdAt: Date | string;
  qrValue: string;
  qrColor: string;
  qrBackground: string;
  qrCornerSquare: string;
  qrCornerDot: string;
  qrCornerDotType: CornerDotType;
  qrIcon: string;
  qrIconName: string;
  qrIconSize: number;
  qrIconHideBackgroundDots: boolean;
  qrIconMargin: number;
  qrSquareType: CornerSquareType;
  qrDotsType: DotType;
  qrLevel: string;
  canvas?: string;
  qrTransparent?: boolean;
  qrMargin: number;
  qrDownloadType: FileExtension;
  qrBackgroundGradient: boolean;
  qrBackgroundGradientData: GradientData;
  qrCornerSquareGradient: boolean;
  qrCornerSquareGradientData: GradientData;
  qrCornerDotGradient: boolean;
  qrCornerDotGradientData: GradientData;
  qrDotsGradient: boolean;
  qrDotsGradientData: GradientData;
};

@Component({
  selector: 'history',
  imports: [
    CdkDropList,
    CdkDrag,
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
  protected readonly userSettings = inject(UserSettingsService);
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
    this.storageService.swapQr(event);
    this.table().renderRows();
  }

  clearHistory() {
    this.storageService.clearHistory();
  }

  removeByDate(date: string) {
    this.storageService.removeQrByDate(date);
  }

  handlePageEvent(event: PageEvent) {
    this.userSettings.userSettings.update((settings) => ({
      ...settings,
      itemsPerPage: event.pageSize,
    }));
    this.userSettings.updateSettings();
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
