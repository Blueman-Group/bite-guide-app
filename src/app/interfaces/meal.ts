import { Additive } from './additive';
import { Allergen } from './allergen';

export interface MealInterface {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  additives: Additive[];
  allergies: Allergen[];
  imageUrl: string;
}
