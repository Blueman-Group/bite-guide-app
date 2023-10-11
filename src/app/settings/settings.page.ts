import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';
import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';

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
  updating = false;
  selectedDate: string = new Date().toISOString().substring(0, 10);
  loading = false;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    if (!this.router.navigated) this.router.navigate(['/']);
  }

  async ngAfterContentChecked() {
    if (!this.updating) {
      this.updating = true;
      this.loading = true;
      if ((await this.storageService.getFavoriteCanteen()) == null) {
        this.updating = false;
        return;
      }
      this.selectedCantineData = await this.storageService.getFavoriteCanteen();
      this.selectedCantine = this.selectedCantineData.canteen._key;
      this.canteens = await this.storageService.getCanteens();

      this.loading = false;
    }
  }

  async onSelectChange() {
    this.loading = true;
    let storageCanteen = this.storageService.setFavorite(this.selectedCantine);
    this.loading = false;
  }
}
