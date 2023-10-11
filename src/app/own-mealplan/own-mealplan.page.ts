import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-own-mealplan',
  templateUrl: './own-mealplan.page.html',
  styleUrls: ['./own-mealplan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class OwnMealplanPage {}
