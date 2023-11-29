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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarHeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit, AfterViewInit {
  selectedCantine: string = '';
  selectedCantineData: StorageCanteen | null = null;
  canteens: Canteen[] = [];
  canteenDataSelected = false;
  // if selected date is weekend set to monday if its a weekday set to today
  selectedDate: Date = new Date().getDay() == 6 || new Date().getDay() == 0 ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000) : new Date();

  formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
  loading = true;
  refreshing = false;

  programSlide = false;

  swiperModules = [IonicSlides];

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private gestureController: GestureController,
    private cdRef: ChangeDetectorRef,
    public platform: Platform,
    private toastController: ToastController,
    private eventAggregator: EventAggregatorService
  ) {}

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
      await this.initCanteenData();
      this.loading = false;
    });
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  async initCanteenData(): Promise<void> {
    const time = new Date().getTime();
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
    let swiper = this.swiperRef?.nativeElement.swiper;
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
    let swiper = this.swiperRef?.nativeElement.swiper;
    swiper.slidePrev(500);
  }

  handleNext() {
    let swiper = this.swiperRef?.nativeElement.swiper;
    swiper.slideNext(500);
  }

  async ngAfterViewInit(): Promise<void> {
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
    if (this.platform.is('mobile')) {
      //gesture.enable();
    }
  }

  // Update the canteen data for the selected canteen if the selected canteen changes
  async onCanteenSelectChange() {
    this.loading = true;
    await this.storageService.updateMenus(this.selectedCantine);
    await this.select(this.selectedCantine, this.selectedDate);
    this.loading = false;
  }

  async select(canteenKey: string, date: Date, initialize = true): Promise<void> {
    if (initialize) {
      this.selectedCantineData = await this.storageService.getCanteen(canteenKey);
      this.selectedCantine = canteenKey;
    }
    this.selectedDate = date;
    await this.updateNextDayButtonState();
    await this.updatePrevDayButtonState();
    this.cdRef.detectChanges();
    if (initialize) this.swiperRef!.nativeElement.initialize();
    let indexOfTodaysMenu = this.selectedCantineData?.menu.findIndex((menu) => menu.date === this.getDateAsString(this.selectedDate));
    this.programSlide = true;
    if (indexOfTodaysMenu != -1) {
      this.swiperRef!.nativeElement.swiper.slideTo(indexOfTodaysMenu, 300);
    } else {
      this.swiperRef!.nativeElement.swiper.slideTo(0, 300);
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
    this.selectedDate = new Date();
    await this.updateNextDayButtonState();
    await this.updatePrevDayButtonState();
    this.formattedDate = formatDate(this.selectedDate, 'EEE dd.MM.YY', 'de-DE');
    this.select(this.selectedCantine, this.selectedDate, false);
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
      await this.select(this.selectedCantine, this.selectedDate);
      clearTimeout(timeoutId);
      event.target.complete();
    });
  }

  private async tryRefresh(intervalInMs: number): Promise<void> {
    while (!(await this.storageService.reloadMenuesOfCanteenFromDb(this.selectedCantine)) && this.refreshing) {
      await new Promise((resolve) => setTimeout(resolve, intervalInMs));
    }
  }
}
