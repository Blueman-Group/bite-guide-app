import { time } from 'console';
import { Additive } from '../interfaces/additive';
import { Allergen } from '../interfaces/allergen';
import { MealInterface } from '../interfaces/meal';

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

  constructor(
    _key: string,
    name: string,
    mealCategory: string,
    normalPrice: number,
    studentPrice: number,
    co2PerPortion: number,
    additives: Additive[],
    allergens: Allergen[],
    imageUrl: string
  ) {
    this._key = _key;
    this.name = name;
    this.mealCategory = mealCategory;
    this.normalPrice = normalPrice;
    this.studentPrice = studentPrice;
    this.co2PerPortion = co2PerPortion;
    if (co2PerPortion < 500) {
      this.co2ClassInfo = 'success';
    } else if (co2PerPortion < 1000) {
      this.co2ClassInfo = 'warning';
    } else {
      this.co2ClassInfo = 'danger';
    }
    this.additives = additives;
    this.allergens = allergens;
    this.imageUrl = imageUrl;
  }
}
