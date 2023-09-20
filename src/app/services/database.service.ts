import { Injectable } from '@angular/core';
import { ArangoDriver } from '../arango-driver/arango-driver';
import { __param } from 'tslib';
import { Meal } from '../classes/meal';
import { Allergy } from '../interfaces/allergeen';
import { Additive } from '../interfaces/additive';
import { Canteen } from '../interfaces/canteen';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _arango: ArangoDriver = ArangoDriver.getInstance();

  public async getMealsAtDate(date: Date, canteen: Canteen): Promise<Meal[]> {
    let collection = this._arango.getMealPlanCollection();
    let cursor = await this._arango
      .getDatabase()
      .query(
        `FOR m IN \`${collection.name}\` FILTER m.date == "${date
          .toISOString()
          .substring(0, 10)}" AND m.canteenId == ${canteen._key} RETURN m`
      );

    let result = await cursor.all();
    let mealList: Meal[] = [];
    for (let resultDoc of result) {
      for (let mealKey of resultDoc.meals) {
        let meal = await this.getMeal(mealKey);
        mealList.push(meal);
      }
    }
    return mealList;
  }

  public async getMeal(_key: string): Promise<Meal> {
    if (await this._arango.getMealCollection().documentExists(_key)) {
      let mealDb = await this._arango.getMealCollection().document(_key);
      let additives: Additive[] = [];
      for (let additiveKey of mealDb.additives) {
        additives.push(await this.getAdditive(additiveKey));
      }
      let allergies: Allergy[] = [];
      for (let allergyKey of mealDb.allergens) {
        allergies.push(await this.getAllergy(allergyKey));
      }
      return new Meal(
        mealDb._key,
        mealDb.name,
        mealDb.mealCategory,
        mealDb.normalPrice,
        mealDb.studentPrice,
        mealDb.co2PerPortion,
        additives,
        allergies,
        mealDb.labels,
        mealDb.meatCategories
      );
    } else {
      throw new Error('Meal not found');
    }
  }

  public async getAllergy(_key: string): Promise<Allergy> {
    if (await this._arango.getAllergyCollection().documentExists(_key)) {
      return await this._arango.getAllergyCollection().document(_key);
    } else {
      throw new Error('Allergen not found');
    }
  }

  public async getAdditive(_key: string): Promise<Additive> {
    if (await this._arango.getAdditiveCollection().documentExists(_key)) {
      return await this._arango.getAdditiveCollection().document(_key);
    } else {
      throw new Error('Additive not found');
    }
  }

  public async getCanteens(): Promise<Canteen[]> {
    let cursor = await this._arango
      .getDatabase()
      .query(`FOR c IN canteen RETURN c`);
    let result = await cursor.all();
    let canteenList: Canteen[] = [];
    for (let resultDoc of result) {
      canteenList.push(resultDoc);
    }
    return canteenList;
  }
}
