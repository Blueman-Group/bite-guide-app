import { Meal } from '../classes/meal';
import { Canteen } from './canteen';

export interface StorageCanteen {
  canteen: Canteen;
  menu: {
    date: string;
    meals: Meal[];
  }[];
}
