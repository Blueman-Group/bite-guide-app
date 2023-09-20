import { Additive } from '../interfaces/additive';
import { Allergy } from '../interfaces/allergy';
import { Label } from '../interfaces/label';
import { MealInterface } from '../interfaces/meal';

export class Meal implements MealInterface {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  additives: Additive[];
  allergies: Allergy[];
  labels: Label[];
  meatCategories: string[];

  constructor(
    _key: string,
    name: string,
    mealCategory: string,
    normalPrice: number,
    studentPrice: number,
    co2PerPortion: number,
    additives: Additive[],
    allergies: Allergy[],
    labels: Label[],
    meatCategories: string[]
  ) {
    this._key = _key;
    this.name = name;
    this.mealCategory = mealCategory;
    this.normalPrice = normalPrice;
    this.studentPrice = studentPrice;
    this.co2PerPortion = co2PerPortion;
    this.additives = additives;
    this.allergies = allergies;
    this.labels = labels;
    this.meatCategories = meatCategories;
  }
}
