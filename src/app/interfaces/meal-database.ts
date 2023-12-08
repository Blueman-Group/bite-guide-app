export interface MealDatabase {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  additiveIds: string[];
  allergenIds: string[];
  imageUrl: string;
}
