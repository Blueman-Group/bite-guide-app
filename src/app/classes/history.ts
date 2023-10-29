import {MealInformation } from './meal';

export class HistoryMeal {
  
  _key: string;

  name: string;
  normalPrice: number;
  studentPrice: number;
  imageUrl: string;

  constructor(
    _key: string,
    name: string,
    imageUrl: string,
    mealInformation: MealInformation
  ) {
    this._key = _key;
    this.name = name;
    this.normalPrice = mealInformation.normalPrice;
    this.studentPrice = mealInformation.studentPrice;
    this.imageUrl = imageUrl;

}
}
