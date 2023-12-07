import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { StorageService } from '../services/storage.service';

import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { Router } from '@angular/router';
import { HistoryMeal } from '../classes/history-meal';
import localeDe from '@angular/common/locales/de';
import { ChangeDetectorRef } from '@angular/core';

registerLocaleData(localeDe);
register();

interface HistoryItem {
  date: string;
  data: Map<string, HistoryMealView>;
}

class HistoryMealView {
  name: string;
  normalPrice: number;
  studentPrice: number;
  imageUrl: string;
  canteenId: string;
  canteenName: string;

  constructor(name: string, normalPrice: number, studentPrice: number, imageUrl: string, canteenId: string, canteenName: string) {
    this.name = name;
    this.normalPrice = normalPrice;
    this.studentPrice = studentPrice;
    this.imageUrl = imageUrl;
    this.canteenId = canteenId;
    this.canteenName = canteenName;
  }
}

@Component({
  selector: 'app-own-mealplan',
  templateUrl: './own-mealplan.page.html',
  styleUrls: ['./own-mealplan.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, NavbarHeaderComponent],
})
export class OwnMealplanPage implements OnInit {
  swiperModules = [IonicSlides];
  updating = false;
  thisWeekArray: HistoryItem[] = [];
  nextWeekArray: HistoryItem[] = [];
  date = new Date();
  thisWeek = '0';
  nextWeek = '0';

  constructor(private storageService: StorageService, private eventAggregator: EventAggregatorService, private router: Router, private cd: ChangeDetectorRef) {}

  async ionViewWillEnter() {
    await this.updateHistory();
    this.cd.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate(['/'], { skipLocationChange: true });
    }

    if (this.date.getDay() === 0) {
      this.date.setDate(this.date.getDate() + 1);
    }
    if (this.date.getDay() === 6) {
      this.date.setDate(this.date.getDate() + 2);
    }
    this.thisWeek = this.getWeek(this.date);
    this.nextWeek = (parseInt(this.thisWeek) + 1).toString();
    await this.waitForStart();
    await this.updateHistory();
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
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

  async delMealInHistory(date: string, mealkey: string, cantine: string | undefined) {
    if (cantine) {
      await this.storageService.deleteMealInHistory(new Date(date), mealkey, cantine);
      await this.updateHistory();
    }
  }

  async updateHistroyWeek(history: any, weekNum: string): Promise<HistoryItem[]> {
    let weekArray: HistoryItem[] = [];
    let week = history[weekNum];
    if (week) {
      for (let [date, data] of Object.entries(week)) {
        let historyMeals: Map<string, HistoryMeal> = new Map(Object.entries(data as { [mealKey: string]: HistoryMeal }));
        let histroyMealViews: Map<string, HistoryMealView> = new Map();
        for (let [mealKey, historyMeal] of historyMeals.entries()) {
          let canteenName = (await this.storageService.getCanteen(historyMeal.canteenId))?.canteen?.name;
          histroyMealViews.set(
            mealKey,
            new HistoryMealView(historyMeal.name, historyMeal.normalPrice, historyMeal.studentPrice, historyMeal.imageUrl, historyMeal.canteenId, canteenName)
          );
        }
        weekArray.push({ date: date, data: histroyMealViews });
      }
    }
    return weekArray;
  }

  async updateHistory() {
    let history = await this.storageService.getHistory();
    this.thisWeekArray = await this.updateHistroyWeek(history, this.thisWeek);
    this.nextWeekArray = await this.updateHistroyWeek(history, this.nextWeek);
  }

  thisDataEmpty(): boolean {
    console.log(this.thisWeekArray);
    return this.thisWeekArray.every((item) => item.data.keys.length === 0);
  }

  nextDataEmpty(): boolean {
    return this.nextWeekArray.every((item) => item.data.keys.length === 0);
  }
}
