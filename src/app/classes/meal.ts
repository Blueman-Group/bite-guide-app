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
  additives: Additive[];
  allergies: Allergen[];

  constructor(
    _key: string,
    name: string,
    mealCategory: string,
    normalPrice: number,
    studentPrice: number,
    co2PerPortion: number,
    additives: Additive[],
    allergies: Allergen[]
  ) {
    this._key = _key;
    this.name = name;
    this.mealCategory = mealCategory;
    this.normalPrice = normalPrice;
    this.studentPrice = studentPrice;
    this.co2PerPortion = co2PerPortion;
    this.additives = additives;
    this.allergies = allergies;
  }
}
