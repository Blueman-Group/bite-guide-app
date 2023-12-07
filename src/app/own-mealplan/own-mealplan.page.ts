import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { StorageService } from '../services/storage.service';

import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { Router } from '@angular/router';
import { HistoryMeal } from '../classes/history-meal';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);
register();

interface HistoryItem {
  date: string;
  data: Record<string, HistoryMeal>; // Replace 'string' with the actual type of 'meal' if known
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

  constructor(private storageService: StorageService, private eventAggregator: EventAggregatorService, private router: Router) {}

  async ionViewWillEnter() {
    await this.updateHistory();
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
    await this.waitForStart().then(async () => {
      this.updateHistory();
    });
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
  getKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  async delMealInHistory(date: string, mealkey: string, cantine: string) {
    await this.storageService.deleteMealInHistory(new Date(date), mealkey, cantine);
    await this.updateHistory();
  }

  async updateHistory() {
    await this.storageService.getHistory().then((history) => {
      if (history) {
        let thisWeek = history[this.thisWeek];
        if (thisWeek) {
          this.thisWeekArray = Object.entries(thisWeek).map(([date, data]) => ({ date, data: data as { meal: HistoryMeal } }));
        }
        let nextWeek = history[this.nextWeek];
        if (nextWeek) {
          this.nextWeekArray = Object.entries(nextWeek).map(([date, data]) => ({ date, data: data as { meal: HistoryMeal } }));
        }
      }
    });
  }

  thisDataEmpty(): boolean {
    return this.thisWeekArray.every((item) => this.getKeys(item.data).length === 0);
  }

  nextDataEmpty(): boolean {
    return this.nextWeekArray.every((item) => this.getKeys(item.data).length === 0);
  }

  getCanteenName(canteen: string): string {
    switch (canteen) {
      case '1':
        return 'Mensa Ludwigsburg';
      case '2':
        return 'Mensa Vaihingen';
      case '4':
        return 'Mensa Musikhochschule';
      case '6':
        return 'Mensa Flandernstraße';
      case '7':
        return 'Mensa Kunstakademie';
      case '9':
        return 'Mensa Esslingen';
      case '12':
        return 'Mensa Horb';
      case '13':
        return 'Mensa Göppingen';
      case '16':
        return 'Mensa Central';
      default:
        return 'Mensa';
    }
  }
}
