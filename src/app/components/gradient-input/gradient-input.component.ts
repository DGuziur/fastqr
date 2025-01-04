import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { GradientType } from 'qr-code-styling';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ColorStops } from '../../types/store.types';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

const DEFAULT_COLOR_STOPS: ColorStops = [
  { offset: 0, color: '#ffffff' },
  { offset: 1, color: '#77779C' },
];

type GradientTypeOption = { value: GradientType; icon: string };

@Component({
  selector: 'gradient-input',
  imports: [
    MatListModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatCardModule,
  ],
  templateUrl: './gradient-input.component.html',
  styleUrl: './gradient-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientInputComponent implements AfterViewInit {
  title = input<string>('Gradient');
  value = input<ColorStops>(DEFAULT_COLOR_STOPS);
  valueChanged = output<ColorStops>();
  selectedGradientType = input<GradientType | string>('linear');
  gradientTypeChanged = output<GradientType>();
  rotation = input<number>(0);
  rotationChanged = output<number>();

  ref = inject(ChangeDetectorRef);

  gradientStops = signal<ColorStops>(DEFAULT_COLOR_STOPS);

  protected readonly gradientTypes: GradientTypeOption[] = [
    { value: 'linear', icon: 'arrow_right_alt' },
    { value: 'radial', icon: 'all_out' },
  ];

  ngAfterViewInit(): void {
    this.gradientStops.set(this.value());
  }

  handleColor(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    this.gradientStops.update((stops) => {
      const newStops = [...stops];
      newStops[index].color = target.value;
      return newStops;
    });
    this.valueChanged.emit(this.gradientStops());
  }

  addGradientStop(offset: number = 0, color: string = '#000000') {
    const grad = {
      offset: offset,
      color: color,
    };
    this.gradientStops.update((stops) => [...stops, grad]);
  }

  handleOffset(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const newValue = this.toValidNumber(target.valueAsNumber);
    this.gradientStops.update((stops) => {
      const newStops = [...stops];
      newStops[index].offset = newValue / 100;
      return newStops;
    });
    this.valueChanged.emit(this.gradientStops());
  }

  handleRotation(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rotationChanged.emit(target.valueAsNumber);
  }

  removeGradientStop(index: number) {
    this.gradientStops.update((stops) => stops.filter((_, i) => i !== index));
  }

  toValidNumber(num: number): number {
    if (num > 100) {
      num = 100;
    } else if (num < 0 || isNaN(num)) {
      num = 0;
    }
    return Number(num.toFixed(2));
  }
}
