import { IonicModule, IonicSlides } from '@ionic/angular';
import { GestureController, GestureDetail, Platform, RefresherCustomEvent, ToastController } from '@ionic/angular/standalone';
import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterEvent } from '@angular/router';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';
import { Meal } from '../classes/meal';
import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { MeallistComponent } from '../meallist/meallist.component';
import { DynamicContentComponent } from '../dynamiccontent/dynamiccontent.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarHeaderComponent, DynamicContentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  selectedCantine: string = '';
  selectedCantineData: StorageCanteen | null = null;
  canteens: Canteen[] = [];
  canteenDataSelected = false;
  history = undefined;
  kw: string = this.getWeek(new Date());
  // if selected date is weekend set to monday if its a weekday set to today
  selectedDate: Date = this.getActualDate();
  stringDate: string = this.selectedDate.toISOString().substring(0, 10);
  formattedDate: string = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');

  loading = true;
  refreshing = false;

  programSlide = false;

  MealList = MeallistComponent;

  constructor(
    private router: Router,
    private storageService: StorageService,
    public platform: Platform,
    private toastController: ToastController,
    private eventAggregator: EventAggregatorService
  ) {}

  getActualDate(): Date {
    return new Date().getDay() == 6 || new Date().getDay() == 0 ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000) : new Date();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.updateHistory();
  }

  async ngOnInit(): Promise<void> {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate(['/'], { skipLocationChange: true });
      let eventSubscribtion = this.router.events.subscribe(async (event) => {
        if (event instanceof RouterEvent) {
          if (event.url.includes('home') && event.url.includes('reload=true')) {
            await this.initCanteenData();
            eventSubscribtion.unsubscribe();
          }
        }
      });
    }
    await this.waitForStart().then(async () => {
      this.loading = true;
      await this.init();
      this.loading = false;
    });
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  async init() {
    this.history = await this.storageService.getHistory();
    await this.initCanteenData();
  }

  async initCanteenData(): Promise<void> {
    this.canteens = await this.storageService.getCanteens();
    if (this.canteens.length > 0) {
      let canteenKey = await this.storageService.getFavoriteCanteenKey();

      if (!canteenKey) {
        canteenKey = this.canteens[0]._key;
      }
      this.select(canteenKey, this.selectedDate);
    } else {
      this.toastController
        .create({
          message: 'Es konnten keine Kantinen gefunden werden. Bitte versuchen Sie die Seite neu zu laden!',
          duration: 5000,
          position: 'top',
          color: 'danger',
          icon: 'cloud-offline-outline',
        })
        .then(async (toast) => {
          await toast.present();
        });
    }
  }

  slideChanged() {
    let swiper = document.querySelector('swiper-container')?.swiper!;
    let activeIndex = swiper.activeIndex;
    let prevIndex = swiper.previousIndex;
    if (activeIndex == prevIndex || this.programSlide) {
      this.programSlide = false;
      return;
    } else if (activeIndex > prevIndex) {
      this.incrementDate();
    } else {
      this.decrementDate();
    }
  }

  handleBack() {
    let swiper = document.querySelector('swiper-container')!.swiper;
    swiper.slidePrev(500);
  }

  handleNext() {
    let swiper = document.querySelector('swiper-container')!.swiper;
    swiper.slideNext(500);
  }

  // Update the canteen data for the selected canteen if the selected canteen changes
  async onCanteenSelectChange() {
    this.loading = true;
    await this.storageService.updateMenus(this.selectedCantine);
    this.select(this.selectedCantine, this.getActualDate());
    this.loading = false;
  }

  async select(canteenKey: string, date: Date, refresh = false): Promise<void> {
    if (this.selectedCantineData?.canteen._key != canteenKey || refresh) {
      this.eventAggregator.mealPlanInjected.next(false);
      this.selectedCantineData = await this.storageService.getCanteen(canteenKey);
      while (!this.eventAggregator.mealPlanInjected.getValue()) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      this.selectedCantine = canteenKey;
    }
    this.selectedDate = date;
    this.stringDate = this.selectedDate.toISOString().substring(0, 10);
    this.kw = this.getWeek(date);
    this.history = await this.storageService.getHistory();

    await this.updateNextDayButtonState();
    await this.updatePrevDayButtonState();
    let indexOfTodaysMenu = this.selectedCantineData!.menu.findIndex((menu) => menu.date === this.getDateAsString(date));
    let swiper = document.querySelector('swiper-container')?.swiper;
    if (swiper && swiper.activeIndex != indexOfTodaysMenu) {
      if (indexOfTodaysMenu != -1) {
        this.programSlide = true;
        swiper.slideTo(indexOfTodaysMenu, 0);
      } else {
        swiper.slideTo(0, 0);
      }
    }
  }

  // Update the canteen data for the selected date if the selected date changes
  async incrementDate() {
    document.getElementById('prevDay')?.classList.remove('disabled');
    let newDate;
    // if selected date is friday, increment by 3 days
    if (this.selectedDate.getDay() == 5) {
      newDate = new Date(this.selectedDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    } else {
      newDate = new Date(this.selectedDate.getTime() + 24 * 60 * 60 * 1000);
    }
    let canteenMeals = this.getMealsOfSelectedCanteenAt(newDate);
    if (canteenMeals.length == 0 && this.selectedDate.getDay() == 5) {
      return;
    }
    this.selectedDate = newDate;
    this.stringDate = this.selectedDate.toISOString().substring(0, 10);

    this.kw = this.getWeek(this.selectedDate);
    await this.updateNextDayButtonState();
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    if (this.selectedDate.toDateString() != new Date().toDateString()) document.getElementById('today')?.removeAttribute('fill');
    else document.getElementById('today')?.setAttribute('fill', 'outline');
  }

  async decrementDate() {
    document.getElementById('nextDay')?.classList.remove('disabled');
    let newDate;
    if (this.selectedDate.getDay() == 1) {
      newDate = new Date(this.selectedDate.getTime() - 3 * 24 * 60 * 60 * 1000);
    } else {
      newDate = new Date(this.selectedDate.getTime() - 24 * 60 * 60 * 1000);
    }
    let canteenMeals = this.getMealsOfSelectedCanteenAt(newDate);
    if (canteenMeals.length == 0 && this.selectedDate.getDay() == 1) {
      return;
    }
    this.selectedDate = newDate;
    this.stringDate = this.selectedDate.toISOString().substring(0, 10);

    this.kw = this.getWeek(this.selectedDate);
    await this.updatePrevDayButtonState();
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    if (this.selectedDate.toDateString() != new Date().toDateString()) document.getElementById('today')?.removeAttribute('fill');
    else document.getElementById('today')?.setAttribute('fill', 'outline');
  }

  async updateNextDayButtonState() {
    let nextDay;
    if (this.selectedDate.getDay() == 5) {
      nextDay = new Date(this.selectedDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    } else {
      nextDay = new Date(this.selectedDate.getTime() + 24 * 60 * 60 * 1000);
    }
    let nextCanteenMeals = this.getMealsOfSelectedCanteenAt(nextDay);
    if (nextCanteenMeals.length == 0 && nextDay.getDay() == 1) {
      document.getElementById('nextDay')?.classList.add('disabled');
    }
  }

  async updatePrevDayButtonState() {
    let prevDay;
    if (this.selectedDate.getDay() == 1) {
      prevDay = new Date(this.selectedDate.getTime() - 3 * 24 * 60 * 60 * 1000);
    } else {
      prevDay = new Date(this.selectedDate.getTime() - 24 * 60 * 60 * 1000);
    }
    let nextCanteenMeals = this.getMealsOfSelectedCanteenAt(prevDay);
    if (nextCanteenMeals.length == 0 && prevDay.getDay() == 5) {
      document.getElementById('prevDay')?.classList.add('disabled');
    }
  }

  async today() {
    document.getElementById('prevDay')?.classList.remove('disabled');
    document.getElementById('nextDay')?.classList.remove('disabled');
    document.getElementById('today')?.setAttribute('fill', 'outline');
    // selected date to today
    this.selectedDate = this.getActualDate();
    await this.updateNextDayButtonState();
    await this.updatePrevDayButtonState();
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    this.select(this.selectedCantine, this.selectedDate);
  }

  getDateAsString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  getMealsOfSelectedCanteenAt(date: Date): Meal[] {
    return this.selectedCantineData?.menu.find((menu) => menu.date === this.getDateAsString(date))?.meals ?? [];
  }

  async handleRefresh(ev: Event) {
    this.refreshing = true;
    let event: RefresherCustomEvent = ev as RefresherCustomEvent;
    let timeoutId = setTimeout(() => {
      this.refreshing = false;
      this.toastController
        .create({
          message: 'Es konnten keine Gerichte aktualisiert werden. Möglicherweise besteht keine Verbindung zum Internet. Bitte versuche es später erneut.',
          duration: 5000,
          position: 'top',
          color: 'danger',
          icon: 'cloud-offline-outline',
        })
        .then(async (toast) => {
          await toast.present();
        });
    }, 5000);
    this.tryRefresh(1000).then(async () => {
      this.refreshing = false;
      await this.select(this.selectedCantine, this.selectedDate, true);
      clearTimeout(timeoutId);
      event.target.complete();
    });
  }

  private async tryRefresh(intervalInMs: number): Promise<void> {
    while (!(await this.storageService.reloadMenuesOfCanteenFromDb(this.selectedCantine)) && this.refreshing) {
      await new Promise((resolve) => setTimeout(resolve, intervalInMs));
    }
  }

  public trackItem(index: number, item: { date: string; meals: Meal[] }) {
    return item.date + item.meals.length;
  }

  async updateHistory() {
    this.history = await this.storageService.getHistory();
  }

  getWeek(date: Date): string {
    let dowOffset = 1; //start week on monday
    let newYear = new Date(date.getFullYear(), 0, 1);
    let day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = day >= 0 ? day : day + 7;
    let daynum = Math.floor((date.getTime() - newYear.getTime() - (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    let weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
      weeknum = Math.floor((daynum + day - 1) / 7) + 1;
      if (weeknum > 52) {
        let nYear = new Date(date.getFullYear() + 1, 0, 1);
        let nday = nYear.getDay() - dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        //if the next year starts before the middle of the week, it is week #1 of that year
        weeknum = nday < 4 ? 1 : 53;
      }
    } else {
      weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum.toString();
  }
}
