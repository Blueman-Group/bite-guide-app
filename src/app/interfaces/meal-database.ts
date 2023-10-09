export interface MealDatabase {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  additives: string[];
  allergens: string[];
  imageUrl: string;
}
