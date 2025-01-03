import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
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
  ],
  templateUrl: './gradient-input.component.html',
  styleUrl: './gradient-input.component.scss',
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

  gradientStopsForm = new FormArray<FormGroup>([]);

  protected readonly gradientTypes: GradientTypeOption[] = [
    { value: 'linear', icon: 'arrow_right_alt' },
    { value: 'radial', icon: 'all_out' },
  ];

  ngAfterViewInit(): void {
    this.value().forEach((stop) => {
      this.addGradientStop(stop.offset, stop.color);
    });
    this.gradientStopsForm.valueChanges.subscribe((value: ColorStops) => {
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
    this.rotationChanged.emit(target.valueAsNumber);
  }

  removeGradientStop(index: number) {
    this.gradientStopsForm.removeAt(index);
  }
}
