import { inject, Injectable } from '@angular/core';
import { qrIconStore } from '../store/qr-data.store';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly qrIconStore = inject(qrIconStore);

  private readonly validExtensions = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'application/pdf',
  ];

  uploadImage(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      throw console.error('No file selected');
    }

    const file = target.files[0];

    if (!this.validExtensions.includes(file.type)) {
      throw console.error('Invalid file type.');
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.qrIconStore.update({
        name: file.name,
        src: base64String,
        size: 0.5,
      });
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
    target.value = '';
  }
}
