import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'phone-contact-form',
  imports: [MatInputModule, ReactiveFormsModule, MatCardModule, MatIconModule],
  templateUrl: './phone-contact-form.component.html',
  styleUrl: './phone-contact-form.component.scss',
})
export class PhoneContactFormComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  valueChanged = output<string>();

  contactForm: FormGroup = new FormGroup({
    BEGIN: new FormControl('VCARD'),
    VERSION: new FormControl('3.0'),
    FN: new FormControl(null),
    TEL: new FormControl(null),
    EMAIL: new FormControl(null),
    ADR: new FormControl(null),
    ORG: new FormControl(null),
    TITLE: new FormControl(null),
    URL: new FormControl(null),
    END: new FormControl('VCARD'),
  });

  ngAfterViewInit(): void {
    this.contactForm.valueChanges
      .pipe(debounceTime(1000), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const stringValue = Object.entries(value)
          .map(([key, value]) => `${key}:${value}`)
          .join('\n');
        console.log(stringValue);
        this.valueChanged.emit(stringValue);
      });
  }
}
