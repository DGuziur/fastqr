import { Component, input, output } from '@angular/core';
import { ErrorCodeLevel } from '../../features/qr-generator/qr-generator.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'segmented',
  standalone: true,
  imports: [MatButtonToggleModule, ReactiveFormsModule],
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.scss',
})
export class SegmentedComponent {
  options = input.required<ErrorCodeLevel[]>();
  optionChanged = output<ErrorCodeLevel>();

  errorLevel = new FormControl<ErrorCodeLevel>('L', Validators.required);

  handleOptionChange() {
    if (!this.errorLevel.value) {
      throw new Error('No option selected');
    }
    this.optionChanged.emit(this.errorLevel.value);
  }
}