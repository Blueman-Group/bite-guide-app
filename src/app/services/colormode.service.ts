import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ColorModeService {
  darkMode = false;

  // inject StorageService and init color mode
  constructor(private storageService: StorageService) {
    this.init();
  }

  /**
   * Init preferred color mode
   * Check if colormode is saved in storage and set it, if not check if the device prefers dark mode and set it
   */
  async init() {
    let colormode = await this.storageService.getColorMode();
    if (colormode) {
      this.initializeDarkMode(colormode === 'dark');
    } else {
      //get css match-media if dark mode is preferred
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.initializeDarkMode(prefersDark.matches);
    }
  }

  /**
   * Initialize dark mode and set it if preferred
   * @param isDark Boolean if dark mode is preferred
   */
  initializeDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    if (this.darkMode) {
      this.toggleDarkMode();
      //set icon of dark mode switch
      document.getElementById('darkModeChanger_icon')?.setAttribute('name', 'moon-outline');
    } else {
      //set icon of dark mode switch
      document.getElementById('darkModeChanger_icon')?.setAttribute('name', 'sunny-outline');
    }
  }

  /**
   * Toggle dark mode
   * Toggle dark class to body to set dark mode
   */
  toggleDarkMode() {
    document.body.classList.toggle('dark');
    this.darkMode = document.body.classList.contains('dark');
  }
}
