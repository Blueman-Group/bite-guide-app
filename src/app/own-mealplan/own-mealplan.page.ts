import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import {StorageService} from '../services/storage.service';
import { Meal } from '../classes/meal';

import { NavbarHeaderComponent } from '../navbar-header/navbar-header.component';
import swiper from 'swiper';
import { StorageHistory } from '../interfaces/storage-history';
import { HistoryMeal } from '../classes/history';

@Component({
  selector: 'app-own-mealplan',
  templateUrl: './own-mealplan.page.html',
  styleUrls: ['./own-mealplan.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, NavbarHeaderComponent],
})
export class OwnMealplanPage {
  swiperModules = [IonicSlides];
  updating = false;
  history = {};
  constructor(private storageService: StorageService) {
    register();
  }

  async ngAfterContentChecked() {
    if (!this.updating) {
    
      this.updating = true;
      await this.storageService.getHistory().then(history => {
        this.history = history;
        this.updating = false;
      });
      console.log(this.history);
    }
  }

  test(swiper: Swiper) {
    console.log(swiper.swipeDirection);
    if (swiper.swipeDirection === 'next') {
      console.log('next');
    } else {
      console.log('prev');
    }
  }

  async set() {
    await this.storageService.setHistory();
  }

}


