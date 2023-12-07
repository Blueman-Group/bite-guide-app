import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../classes/meal';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppModalComponent } from '../app-modal/app-modal.component';

@Component({
  selector: 'app-mealcard',
  templateUrl: './mealcard.component.html',
  styleUrls: ['./mealcard.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class MealcardComponent {
  @Input() meal: Meal | undefined;
  @Input() date: string | undefined;

  constructor(private modalController: ModalController) {}

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
}
