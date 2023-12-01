import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../classes/meal';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}
