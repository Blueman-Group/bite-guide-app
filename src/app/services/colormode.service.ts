import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ColorModeService {
  darkMode = false;

  constructor(private storageService: StorageService) {
    this.init();
  }

  async init() {
    let colormode = await this.storageService.getColorMode();
    if (colormode) {
      this.initializeDarkMode(colormode === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.initializeDarkMode(prefersDark.matches);
    }
  }

  initializeDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    if (isDark) this.toggleDarkMode();
    if (this.darkMode) {
      document
        .getElementById('darkModeChanger_icon')
        ?.setAttribute('name', 'moon-outline');
    } else {
      document
        .getElementById('darkModeChanger_icon')
        ?.setAttribute('name', 'sunny-outline');
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
    this.darkMode = document.body.classList.contains('dark');
  }
}
