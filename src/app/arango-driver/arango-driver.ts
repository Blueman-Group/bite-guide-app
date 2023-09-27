import { Database } from 'arangojs';
import { MealDatabase } from '../interfaces/meal-database';
import { MealPlan } from '../interfaces/mealplan';
import { Additive } from '../interfaces/additive';
import { Allergen } from '../interfaces/allergen';
import { Canteen } from '../interfaces/canteen';

export class ArangoDriver {
  private static _instance: ArangoDriver;
  private _db: Database;

  constructor() {
    this._db = new Database({
      url: 'https://arango.envyz.de',
      databaseName: 'dhbw',
      auth: { username: 'dhbw', password: '5fBjsWvtEBDQMt#!k6jtE6fSca^&$2fn' },
    });
  }

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
    return this._db.collection<MealPlan>('meal-plan');
  }

  public getAdditiveCollection() {
    return this._db.collection<Additive>('additive');
  }

  public getAllergyCollection() {
    return this._db.collection<Allergen>('allergy');
  }

  public getCanteenCollection() {
    return this._db.collection<Canteen>('canteen');
  }

  public getDatabase() {
    return this._db;
  }
}
