import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly duration = 1000;

  open(message: string, action: string = 'Ok') {
    this.snackBar.open(message, 'Ok', { duration: this.duration });
  }
}
