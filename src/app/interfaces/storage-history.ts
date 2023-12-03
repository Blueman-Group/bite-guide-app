import { HistoryMeal } from '../classes/history-meal';

export interface StorageHistory {
  date: {
    meals: HistoryMeal[];
  }[];
}
