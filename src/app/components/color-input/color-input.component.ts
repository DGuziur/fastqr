import { Component, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './color-input.component.html',
  styleUrl: './color-input.component.scss',
})
export class ColorInputComponent {
  label = input('Label');
  defaultColor = input('#000000');

  colorChanged = output<string>();

  value = signal('#000000');

  protected handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.value) throw console.error('No color selected');
    this.value.set(target.value);
    this.colorChanged.emit(target.value);
  }
}
