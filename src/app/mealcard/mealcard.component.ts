import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { Meal } from '../classes/meal';
import { IonicModule, ModalController, ViewWillEnter } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { StorageService } from '../services/storage.service';
import { EventAggregatorService } from '../services/event-aggregator.service';

@Component({
  selector: 'app-mealcard',
  templateUrl: './mealcard.component.html',
  styleUrls: ['./mealcard.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class MealcardComponent implements OnInit {
  @Input() meal: Meal | undefined;
  @Input() date: string | undefined;
  @Input() canteenKey: string | undefined;

  kw: string | undefined;
  history: any | undefined;
  dateObject: Date | undefined;

  constructor(private modalController: ModalController, private storageService: StorageService, private eventAggregator: EventAggregatorService) {}

  async ngOnInit(): Promise<void> {
    this.dateObject = new Date(this.date!);
    this.kw = this.getWeek(this.dateObject);
    this.history = await this.storageService.getHistory();
    this.eventAggregator.viewEnter.subscribe((value) => {
      if (value) {
        this.updateHistory().then((history) => (this.history = history));
        this.eventAggregator.viewEnter.next(false);
      }
    });
  }

  openAllergensModal() {
    this.modalController
      .create({
        component: AppModalComponent,
        componentProps: {
          infos: this.meal?.allergens,
          name: this.meal?.name,
          title: 'Allergene',
        },
        initialBreakpoint: 1,
        breakpoints: [0, 1],
      })
      .then((modal) => modal.present());
  }

  openAdditivesModal() {
    this.modalController
      .create({
        component: AppModalComponent,
        componentProps: {
          infos: this.meal?.additives,
          name: this.meal?.name,
          title: 'Zusatzstoffe',
        },
        initialBreakpoint: 1,
        breakpoints: [0, 1],
      })
      .then((modal) => modal.present());
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

  async addMealToHistory(meal: Meal) {
    await this.storageService.addMealToHistory(this.dateObject!, meal, this.canteenKey!);
    await this.updateHistory();
  }

  async delMealInHistory(meal: Meal) {
    await this.storageService.deleteMealInHistory(this.dateObject!, meal._key + '-' + this.canteenKey!);
    await this.updateHistory();
  }

  async updateHistory() {
    this.history = await this.storageService.getHistory();
  }
}
