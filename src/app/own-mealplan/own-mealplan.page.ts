import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { StorageService } from '../services/storage.service';

import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { Router } from '@angular/router';
import { get } from 'http';
import {HistoryMeal} from '../classes/history';

interface HistoryItem {
  date: string;
  data: Record<string, HistoryMeal>;// Replace 'string' with the actual type of 'meal' if known
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
  history = {};
  historyArray: HistoryItem[]=[];

  constructor(private storageService: StorageService, private eventAggregator: EventAggregatorService, private router: Router) {
    register();
  }

  async ngOnInit(): Promise<void> {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate(['/'], { skipLocationChange: true });
    }
    await this.waitForStart().then(async () => {
      await this.storageService.getHistory().then((history) => {
        this.history = history[this.getWeek(new Date())];
        this.historyArray = Object.entries(this.history).map(([date, data]) => ({ date, data: data as { meal: HistoryMeal; } }));      });
      console.log(this.historyArray);
    });
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  test(swiper: Swiper) {
    if (swiper.swipeDirection === 'next') {
      console.log('next');
      console.log(this.history);
    } else {
      console.log('prev');
    }
  }

  async set() {
    await this.storageService.setHistory();
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
}
