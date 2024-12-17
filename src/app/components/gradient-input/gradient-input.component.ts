import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  model,
  output,
  Signal,
  signal,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { GradientType } from 'qr-code-styling';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DEFAULT_COLOR_STOPS } from '../../services/qr-data.service';

type GradientTypeOption = { value: GradientType; icon: string };
export type ColorStops = {
  offset: number;
  color: string;
}[];
@Component({
  selector: 'gradient-input',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './gradient-input.component.html',
  styleUrl: './gradient-input.component.scss',
})
export class GradientInputComponent implements AfterViewInit {
  title = input<string>('Gradient');
  value = input<ColorStops>(DEFAULT_COLOR_STOPS);
  valueChanged = output<ColorStops>();
  selectedGradientType = model<GradientType | string>('linear');
  rotation = model<number | Signal<number>>(0);

  ref = inject(ChangeDetectorRef);

  gradientStopsForm = new FormArray<FormGroup>([]);

  protected readonly gradientTypes: GradientTypeOption[] = [
    { value: 'linear', icon: 'arrow_right_alt' },
    { value: 'radial', icon: 'all_out' },
  ];

  ngAfterViewInit(): void {
    this.value().forEach((stop) => {
      this.addGradientStop(stop.offset, stop.color);
    });
    this.gradientStopsForm.valueChanges.subscribe((value) => {
      this.valueChanged.emit(value);
    });
    this.ref.detectChanges();
  }

  addGradientStop(offset: number = 0, color: string = '#000000') {
    const grad = new FormGroup({
      offset: new FormControl<number>(offset),
      color: new FormControl<string>(color),
    });
    this.gradientStopsForm.push(grad);
  }

  handleRotation(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rotation.set(target.valueAsNumber);
  }

  removeGradientStop(index: number) {
    this.gradientStopsForm.removeAt(index);
  }
}
