import { Database } from 'arangojs';
import { MealDatabase } from '../interfaces/meal-database';
import { MealPlan } from '../interfaces/mealplan';
import { Additive } from '../interfaces/additive';
import { Allergen } from '../interfaces/allergen';
import { Canteen } from '../interfaces/canteen';
import { environment } from 'src/environments/environment';

export class ArangoDriver {
  private static _instance: ArangoDriver;
  private _db: Database;

  // Open connection to Arango database with creds saved in environment
  constructor() {
    this._db = new Database({
      url: environment.arangoUrl,
      databaseName: environment.arangoDatabaseName,
      auth: { username: environment.arangoDatabaseUser, password: environment.arangoDatabasePassword },
    });
  }

  // Singleton pattern
  public static getInstance(): ArangoDriver {
    if (!ArangoDriver._instance) {
      ArangoDriver._instance = new ArangoDriver();
    }
    return ArangoDriver._instance;
  }

  public getMealCollection() {
    return this._db.collection<MealDatabase>('meal');
  }

  public getMealPlanCollection() {
    return this._db.collection<MealPlan>('meal_plan');
  }

  public getAdditiveCollection() {
    return this._db.collection<Additive>('additive');
  }

  public getAllergenCollection() {
    return this._db.collection<Allergen>('allergen');
  }

  public getCanteenCollection() {
    return this._db.collection<Canteen>('canteen');
  }

  public getDatabase() {
    return this._db;
  }
}
