import { Component, input, output, signal } from '@angular/core';
import { ErrorCodeLevel } from '../../features/qr-generator/qr-generator.component';

@Component({
  selector: 'segmented',
  standalone: true,
  imports: [],
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.scss',
})
export class SegmentedComponent {
  options = input.required<ErrorCodeLevel[]>();
  optionChanged = output<ErrorCodeLevel>();

  handleOptionChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.optionChanged.emit(target.value as ErrorCodeLevel);
  }
}
