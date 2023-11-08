import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';
import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import { ColorModeService } from '../services/colormode.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarHeaderComponent],
})
export class SettingsPage implements OnInit {
  selectedCantine: string = '';
  selectedCantineData: StorageCanteen | null = null;
  canteens: Canteen[] = [];
  selectedDate: string = new Date().toISOString().substring(0, 10);
  updating = false;
  version = 'Web';
  timeoutElement: NodeJS.Timeout | null = null;

  constructor(
    private router: Router,
    private storageService: StorageService,
    public colorModeService: ColorModeService,
    private platform: Platform,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    if (!this.router.navigated) {
      this.router.navigate(['']);
      return;
    }
    if (this.platform.is('capacitor')) {
      App.getInfo().then((info) => {
        this.version = info.version + ' (' + info.build + ')';
      });
    } else {
      this.version = 'Web';
    }
  }

  async ngAfterContentChecked() {
    if (!this.updating) {
      this.updating = true;
      if ((await this.storageService.getFavoriteCanteen()) == null) {
        this.updating = false;
        return;
      }
      this.selectedCantineData = await this.storageService.getFavoriteCanteen();
      this.selectedCantine = this.selectedCantineData.canteen._key;
      this.canteens = await this.storageService.getCanteens();
    }
  }

  async onSelectChange() {
    this.storageService.setFavorite(this.selectedCantine);
    await this.presentChangeToast();
  }

  presenceTimeout = (toast: HTMLIonToastElement, duration: number = 5000) => {
    this.timeoutElement = setTimeout(() => {
      duration -= 1000;

      if (duration <= 0) {
        window.location.reload();
        this.timeoutElement = null;
        return;
      }
      toast.message = `Deine Standardkantine wurde geändert! Die App wird in ${duration / 1000} ${
        duration / 1000 == 1 ? 'Sekunde' : 'Sekunden'
      } neu geladen, um die Änderungen zu übernehmen.`;
      this.presenceTimeout(toast, duration);
    }, 1000);
  };

  async presentChangeToast() {
    let duration = 5000;
    const toast = await this.toastController.create({
      message: `Deine Standardkantine wurde geändert! Die App wird in ${duration / 1000} Sekunden neu geladen, um die Änderungen zu übernehmen.`,
      duration: 5500,
      position: 'bottom',
      animated: true,
      color: 'success',
      positionAnchor: 'bottom',
    });

    if (this.timeoutElement) {
      clearTimeout(this.timeoutElement);
    }

    await toast.present();

    this.presenceTimeout(toast);
  }

  toggleDark() {
    this.colorModeService.toggleDarkMode();
    let icon = document.getElementById('darkModeChanger_icon')!;
    this.storageService.setColorMode(this.colorModeService.darkMode ? 'dark' : 'light');
    if (this.colorModeService.darkMode) {
      icon.setAttribute('name', 'moon-outline');
    } else {
      icon.setAttribute('name', 'sunny-outline');
    }
    icon.classList.add('animated');
    setTimeout(() => {
      icon.classList.remove('animated');
    }, 500);
  }
}
