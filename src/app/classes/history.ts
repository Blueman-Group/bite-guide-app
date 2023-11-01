import {MealInformation } from './meal';

export class HistoryMeal {
  
  name: string;
  normalPrice: number;
  studentPrice: number;
  imageUrl: string;

  constructor(
    name: string,
    normalPrice: number,
    studentPrice: number,
    imageUrl: string,
  ) {
    this.name = name;
    this.normalPrice = normalPrice;
    this.studentPrice = studentPrice;
    this.imageUrl = imageUrl;

}
}
