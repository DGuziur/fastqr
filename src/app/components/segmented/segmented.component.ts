import { Component, input } from '@angular/core';

@Component({
  selector: 'app-segmented',
  standalone: true,
  imports: [],
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.scss',
})
export class SegmentedComponent {
  options = input.required<string[]>();
}
