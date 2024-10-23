import { Component } from '@angular/core';
import { QrGeneratorComponent } from './features/qr-generator/qr-generator.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule, MatTabsModule, QrGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fast-qr';
}
