import { Component } from '@angular/core';
import { QrGeneratorComponent } from './features/qr-generator/qr-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QrGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fast-qr';
}
