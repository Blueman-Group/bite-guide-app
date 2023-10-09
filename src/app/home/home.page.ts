import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, AfterContentChecked {
  selectedCantine: string = '';
  selectedCantineData: StorageCanteen | null = null;
  canteens: Canteen[] = [];
  updating = false;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    if (!this.router.navigated) this.router.navigate(['/']);
  }

  async ngAfterContentChecked() {
    if (!this.updating) {
      this.updating = true;
      this.selectedCantineData = await this.storageService.getFavoriteCanteen();
      this.selectedCantine = this.selectedCantineData.canteen._key;
      this.canteens = await this.storageService.getCanteens();
    }
  }

  async onSelectChange() {
    await this.storageService.updateMenus(this.selectedCantine);
    let storageCanteen = await this.storageService.getCanteen(
      this.selectedCantine
    );
    this.selectedCantineData = storageCanteen;
    console.log(this.selectedCantineData);
  }
}
