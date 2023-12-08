import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { MealcardComponent } from '../mealcard/mealcard.component';
import { Meal } from '../classes/meal';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-meallist',
  templateUrl: './meallist.component.html',
  styleUrls: ['./meallist.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MealcardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeallistComponent implements OnInit {
  @Input() menus: { meals: Meal[]; date: string }[] | undefined;
  @Input() homePageInstance: HomePage | undefined;

  swiperModules = [IonicSlides];

  selectedDate = new Date().getDay() == 6 || new Date().getDay() == 0 ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000) : new Date();

  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  constructor(private eventAggregator: EventAggregatorService) {}

  ngOnInit(): void {
    this.eventAggregator.mealPlanInjected.next(true);
  }
}
