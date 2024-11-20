import { Component, input, output } from '@angular/core';
import { ErrorCodeLevel } from '../../features/qr-generator/qr-generator.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'segmented',
  imports: [MatButtonToggleModule, ReactiveFormsModule],
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.scss',
})
export class SegmentedComponent {
  options = input.required<ErrorCodeLevel[]>();
  value = input.required<ErrorCodeLevel>();

  optionChanged = output<ErrorCodeLevel>();

  errorLevel = new FormControl<ErrorCodeLevel>('L', {
    nonNullable: true,
    validators: [Validators.required],
  });

  handleOptionChange() {
    if (!this.errorLevel.value) {
      this.errorLevel.reset();
      throw new Error('No option selected');
    }
    this.optionChanged.emit(this.errorLevel.value);
  }
}
