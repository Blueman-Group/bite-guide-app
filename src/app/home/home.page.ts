import { IonicModule, GestureController, GestureDetail, Platform } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, AfterContentChecked, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';
import { Meal } from '../classes/meal';
import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, NavbarHeaderComponent],
})
export class HomePage implements OnInit, AfterContentChecked, AfterViewInit {
  selectedCantine: string = '';
  selectedCantineData: StorageCanteen | null = null;
  currentMeals: Meal[] = [];
  canteens: Canteen[] = [];
  updating = false;
  // if selected date is weekend set to monday if its a weekday set to today
  selectedDate: string =
    new Date().getDay() == 6 || new Date().getDay() == 0
      ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10);

  formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
  loading = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private gestureController: GestureController,
    private cdRef: ChangeDetectorRef,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    if (!this.router.navigated) this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    const gesture = this.gestureController.create({
      el: document.getElementById('menu-container')!,
      onStart: () => this.cdRef.detectChanges(),
      onMove: (ev: GestureDetail) => {
        let deltaX = ev.deltaX;
        if (deltaX < -50) {
          gesture.enable(false);
          this.incrementDate().then(() => {
            gesture.enable();
          });
        } else if (deltaX > 50) {
          gesture.enable(false);
          this.decrementDate().then(() => {
            gesture.enable();
          });
        }
      },
      onEnd: () => this.cdRef.detectChanges(),
      gestureName: 'swipeOnMenu',
    });
    if (this.platform.is('mobile')) gesture.enable();
  }

  async ngAfterContentChecked() {
    if (!this.updating) {
      this.updating = true;
      this.loading = true;
      if (!(await this.storageService.getFavoriteCanteen())) {
        this.updating = false;
        return;
      }
      this.selectedCantineData = await this.storageService.getFavoriteCanteen();
      this.selectedCantine = this.selectedCantineData.canteen._key;
      this.canteens = await this.storageService.getCanteens();
      this.currentMeals = this.selectedCantineData.menu.find((menu) => menu.date === this.selectedDate)?.meals ?? [];
      this.loading = false;
      if (this.currentMeals.length == 0) this.updating = false;
    }
  }

  // Update the canteen data for the selected canteen if the selected canteen changes
  async onSelectChange() {
    this.loading = true;
    this.currentMeals = [];
    await this.storageService.updateMenus(this.selectedCantine);
    let storageCanteen = await this.storageService.getCanteen(this.selectedCantine);
    this.selectedCantineData = storageCanteen;
    if (this.selectedCantineData) {
      this.currentMeals = this.selectedCantineData.menu.find((menu) => menu.date === this.selectedDate)?.meals ?? [];
    } else {
      this.currentMeals = [];
    }
    this.loading = false;
  }

  // Update the canteen data for the selected date if the selected date changes
  async incrementDate() {
    let newDate = '';
    // if selected date is friday, increment by 3 days
    if (new Date(this.selectedDate).getDay() == 5) {
      newDate = new Date(new Date(this.selectedDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    } else {
      newDate = new Date(new Date(this.selectedDate).getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    }
    let canteenMeals = this.selectedCantineData?.menu.find((menu) => menu.date === newDate)?.meals ?? [];
    if (canteenMeals.length == 0 && new Date(this.selectedDate).getDay() == 5) {
      return;
    }
    this.selectedDate = newDate;
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    this.currentMeals = canteenMeals;
    this.cdRef.detectChanges();
  }

  async decrementDate() {
    let newDate = '';
    if (new Date(this.selectedDate).getDay() == 1) {
      newDate = new Date(new Date(this.selectedDate).getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    } else {
      newDate = new Date(new Date(this.selectedDate).getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    }
    let canteenMeals = this.selectedCantineData?.menu.find((menu) => menu.date === newDate)?.meals ?? [];
    if (canteenMeals.length == 0 && new Date(this.selectedDate).getDay() == 1) {
      return;
    }
    this.selectedDate = newDate;
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    this.currentMeals = canteenMeals;
    this.cdRef.detectChanges();
  }

  async today() {
    // selected date to today
    this.selectedDate = new Date().toISOString().substring(0, 10);
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    this.currentMeals = [];
    this.currentMeals = this.selectedCantineData?.menu.find((menu) => menu.date === this.selectedDate)?.meals ?? [];
  }

  async updateMeals() {
    this.updating = true;
    if (this.updating) return;
    this.selectedCantineData = await this.storageService.getFavoriteCanteen();
    this.selectedCantine = this.selectedCantineData.canteen._key;
    this.canteens = await this.storageService.getCanteens();
    this.currentMeals = this.selectedCantineData.menu.find((menu) => menu.date === this.selectedDate)?.meals ?? [];
    this.updating = false;
  }
}
