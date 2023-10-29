import { HistoryMeal } from '../classes/history';

export interface StorageHistory {
  date: {
    meals: HistoryMeal[];
  }[];
}