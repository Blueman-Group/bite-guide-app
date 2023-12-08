import { Additive } from '../interfaces/additive';
import { Allergen } from '../interfaces/allergen';
import { MealInterface } from '../interfaces/meal';

export interface MealInformation {
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
}

export class Meal implements MealInterface {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  co2ClassInfo: string;
  additives: Additive[];
  allergens: Allergen[];
  imageUrl: string;

  constructor(_key: string, name: string, mealCategory: string, additives: Additive[], allergens: Allergen[], imageUrl: string, mealInformation: MealInformation) {
    this._key = _key;
    this.name = name;
    this.mealCategory = mealCategory;
    this.normalPrice = mealInformation.normalPrice;
    this.studentPrice = mealInformation.studentPrice;
    this.co2PerPortion = mealInformation.co2PerPortion;
    if (this.co2PerPortion < 500) {
      this.co2ClassInfo = 'success';
    } else if (this.co2PerPortion < 1000) {
      this.co2ClassInfo = 'warning';
    } else {
      this.co2ClassInfo = 'danger';
    }
    this.additives = additives;
    this.allergens = allergens;
    this.imageUrl = imageUrl;
  }
}
