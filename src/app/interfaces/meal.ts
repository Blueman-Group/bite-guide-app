import { Additive } from './additive';
import { Allergen } from './allergen';
import { Label } from './label';

export interface MealInterface {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  additives: Additive[];
  allergies: Allergen[];
  labels: Label[];
  meatCategories: string[];
}
