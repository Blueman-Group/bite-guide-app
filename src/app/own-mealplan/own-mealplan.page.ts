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

  constructor(private storageService: StorageService, private eventAggregator: EventAggregatorService, private router: Router) {
    register();
  }

  async ngOnInit(): Promise<void> {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate(['/'], { skipLocationChange: true });
    }
    await this.waitForStart().then(async () => {
      await this.storageService.getHistory().then((history) => {
        this.history = history;
      });
      console.log(this.history);
    });
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  /*async ngAfterContentChecked() {
    if (!this.updating) {
      this.updating = true;
      await this.storageService.getHistory().then((history) => {
        this.history = history;
        this.updating = false;
      });
      console.log(this.history);
    }
  }*/

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
