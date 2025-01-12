import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-resizable-grid',
  imports: [],
  templateUrl: './resizable-grid.component.html',
  styleUrl: './resizable-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableGridComponent {
  columnTemplates = input.required<TemplateRef<any>[]>();
}
