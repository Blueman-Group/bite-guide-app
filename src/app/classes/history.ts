import { HistoryInterface } from '../interfaces/history';
import { Meal } from './meal';

export class History implements HistoryInterface {
  date: string;
  meals: Meal[];
  constructor(date: string, meals: Meal[]) {
    this.date = date;
    this.meals = meals;
  }

  addMeal(meal: Meal): void {
    this.meals.push(meal);
  }
  deleteMeal(meal: Meal): void {}
}
