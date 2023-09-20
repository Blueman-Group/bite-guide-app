import { Additive } from './additive';
import { Allergy } from './allergeen';
import { Label } from './label';

export interface MealInterface {
  _key: string;
  name: string;
  mealCategory: string;
  normalPrice: number;
  studentPrice: number;
  co2PerPortion: number;
  additives: Additive[];
  allergies: Allergy[];
  labels: Label[];
  meatCategories: string[];
}
