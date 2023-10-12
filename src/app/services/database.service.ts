import { Injectable } from '@angular/core';
import { ArangoDriver } from '../arango-driver/arango-driver';
import { Meal } from '../classes/meal';
import { Allergen } from '../interfaces/allergen';
import { Additive } from '../interfaces/additive';
import { Canteen } from '../interfaces/canteen';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _arango: ArangoDriver = ArangoDriver.getInstance();

  /**
   * Check if the connection to the ArangoDB is working
   * @returns true if the connection is working, false if not
   */
  public async checkArangoConnection(): Promise<boolean> {
    try {
      await this._arango.getDatabase().listCollections();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the meals of a given date and canteen out of the database
   * @param date Date of the meal plan
   * @param canteen Canteen of the meal plan
   * @returns Meal objects of the given date and canteen
   */
  public async getMealsAtDate(date: Date, canteen: Canteen): Promise<Meal[]> {
    let collection = this._arango.getMealPlanCollection();
    // AQL query to get the mealplan of the given date and canteen and combines the meal with the additives and allergens and returns it all as array of meals
    let cursor = await this._arango.getDatabase().query(
      `FOR mealplan IN \`${collection.name}\` 
          FILTER mealplan.date == "${date.toISOString().substring(0, 10)}"
          FILTER mealplan.canteenId == "${canteen._key}"
            let meals = (
              for meal in mealplan.mealIds
                  let doc = DOCUMENT(meal)
                  let additives = (
                      for additive in doc.additiveIds
                          let additiveId = CONCAT('additive/', additive)
                          return DOCUMENT(additiveId)
                  )
                  let allergens = (
                      for allergen in doc.allergenIds
                          let allergenId = CONCAT('allergen/', allergen)
                          return DOCUMENT(allergenId)
                  )
                  return {meal: doc, additives: additives, allergens: allergens}
            )
          RETURN meals`
    );

    let result = await cursor.all();
    let mealList: Meal[] = [];
    //create meal object of all returned meals
    for (let resultDoc of result) {
      for (let meal of resultDoc) {
        mealList.push(
          new Meal(
            meal.meal._key,
            meal.meal.name,
            meal.meal.mealCategory,
            meal.meal.normalPrice,
            meal.meal.studentPrice,
            meal.meal.co2PerPortion,
            meal.additives as unknown as Additive[],
            meal.allergens as unknown as Allergen[],
            meal.meal.imageUrl
          )
        );
      }
    }
    return mealList;
  }

  /**
   * Get the allergen object of a given key out of the database
   * @param _key Key of the allergen
   * @returns Allergen object of the given key
   */
  public async getAllergen(_key: string): Promise<Allergen> {
    if (await this._arango.getAllergyCollection().documentExists(_key)) {
      return await this._arango.getAllergyCollection().document(_key);
    } else {
      throw new Error('Allergen not found');
    }
  }

  /**
   * Get the additive object of a given key out of the database
   * @param _key Key of the additive
   * @returns Additive object of the given key
   */
  public async getAdditive(_key: string): Promise<Additive> {
    if (await this._arango.getAdditiveCollection().documentExists(_key)) {
      return await this._arango.getAdditiveCollection().document(_key);
    } else {
      throw new Error('Additive not found');
    }
  }

  /**
   * Get all canteens out of the database
   * @returns Array of canteen objects
   */
  public async getCanteens(): Promise<Canteen[]> {
    let cursor = await this._arango.getDatabase().query(`FOR c IN canteen RETURN c`);
    let result = await cursor.all();
    let canteenList: Canteen[] = [];
    for (let resultDoc of result) {
      canteenList.push(resultDoc);
    }
    return canteenList;
  }

  /**
   * Returns the meal of a given key from the database with additives and allergens
   * @param _key Key of the meal
   * @returns Meal object
   */
  public async getMeal(_key: string): Promise<Meal> {
    if (await this._arango.getMealCollection().documentExists(_key)) {
      let meal = await this._arango.getMealCollection().document(_key);
      let additives = await this.getAdditivesOfMeal(_key);
      let allergens = await this.getAllergensOfMeal(_key);
      return new Meal(
        meal._key,
        meal.name,
        meal.mealCategory,
        meal.normalPrice,
        meal.studentPrice,
        meal.co2PerPortion,
        additives,
        allergens,
        meal.imageUrl
      );
    } else {
      throw new Error('Meal not found');
    }
  }

  /**
   * Get the additives of a given meal from the database
   * @param _key Meal key
   * @returns Array of additive objects
   */
  public async getAdditivesOfMeal(_key: string): Promise<Additive[]> {
    let cursor = await this._arango.getDatabase().query(
      `FOR additive IN additive
        FILTER additive._key IN ${_key}.additiveIds[*]
        RETURN additive`
    );
    let result = await cursor.all();
    let additiveList: Additive[] = [];
    for (let resultDoc of result) {
      additiveList.push(resultDoc);
    }
    return additiveList;
  }

  /**
   * Get the allergens of a given meal from the databas
   * @param _key Meal key
   * @returns Array of allergen objects
   */
  public async getAllergensOfMeal(_key: string): Promise<Allergen[]> {
    let cursor = await this._arango.getDatabase().query(
      `FOR allergen IN allergen
        FILTER allergen._key IN ${_key}.allergenIds[*]
        RETURN allergen`
    );
    let result = await cursor.all();
    let allergenList: Allergen[] = [];
    for (let resultDoc of result) {
      allergenList.push(resultDoc);
    }
    return allergenList;
  }
}
