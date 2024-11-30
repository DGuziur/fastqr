import { Component, DestroyRef, inject, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

export type SecurityType = 'open' | 'wep' | 'wpa' | 'wpa2';
export type WifiConnectData = {
  networkName: string;
  password: string;
  securityType: SecurityType;
};
@Component({
  selector: 'wifi-connect-form',
  imports: [
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './wifi-connect-form.component.html',
  styleUrl: './wifi-connect-form.component.scss',
})
export class WifiConnectFormComponent {
  private readonly destroyRef = inject(DestroyRef);
  valueChanged = output<string>();

  protected readonly securityTypes: SecurityType[] = [
    'open',
    'wep',
    'wpa',
    'wpa2',
  ];

  wifiConnectForm: FormGroup = new FormGroup({
    networkName: new FormControl<string>(''),
    password: new FormControl<string>(''),
    securityType: new FormControl<SecurityType>('wpa'),
  });

  ngAfterViewInit(): void {
    this.wifiConnectForm.valueChanges
      .pipe(debounceTime(1000), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.valueChanged.emit(this.formatToWifiConnectString(value));
      });
  }

  private formatToWifiConnectString(value: WifiConnectData): string {
    return `WIFI:S:${value.networkName};T:${value.securityType};P:${value.password};;`;
  }
}
