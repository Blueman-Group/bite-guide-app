import { Injectable } from '@angular/core';
import { ArangoDriver } from '../arango-driver/arango-driver';
import { Meal, MealInformation } from '../classes/meal';
import { Allergen } from '../interfaces/allergen';
import { Additive } from '../interfaces/additive';
import { Canteen } from '../interfaces/canteen';
import { MealPlan } from '../interfaces/mealplan';

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
      return await this._arango.getDatabase().exists();
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
        let mealInformation = {
          normalPrice: meal.meal.normalPrice,
          studentPrice: meal.meal.studentPrice,
          co2PerPortion: meal.meal.co2PerPortion,
        };
        mealList.push(
          new Meal(meal.meal._key, meal.meal.name, meal.meal.mealCategory, meal.additives as Additive[], meal.allergens as Allergen[], meal.meal.imageUrl, mealInformation)
        );
      }
    }
    return mealList;
  }

  /**
   * Gets all meals having the given ids from the database
   * @param mealIds Ids of the meals to get
   * @returns Array of meals
   */
  public async getMeals(mealIds: string[]): Promise<Meal[]> {
    let mealCollection = this._arango.getMealCollection();
    let additiveCollection = this._arango.getAdditiveCollection();
    let allergenCollection = this._arango.getAllergenCollection();

    let idsArr = mealIds.map((id) => {
      return `"${id}"`;
    });
    let idsArrString = `[ ${idsArr} ]`;

    let cursor = await this._arango.getDatabase().query(
      `FOR m IN \`${mealCollection.name}\`
        FILTER m._id IN ${idsArrString}  
        LET additives = (
            FOR a IN \`${additiveCollection.name}\`
                FILTER a._key IN m.additiveIds
                RETURN a
              )
        LET allergens = (
            FOR a IN \`${allergenCollection.name}\`
                FILTER a._key IN m.allergenIds
                RETURN a
              )
        RETURN merge(m, {additiveIds: additives, allergenIds: allergens})`
    );
    let mealList: Meal[] = [];
    let result = await cursor.all();
    for (let resultDoc of result) {
      let mealInformation = {
        normalPrice: resultDoc.normalPrice,
        studentPrice: resultDoc.studentPrice,
        co2PerPortion: resultDoc.co2PerPortion,
      };
      mealList.push(
        new Meal(
          resultDoc._key,
          resultDoc.name,
          resultDoc.mealCategory,
          resultDoc.additiveIds as Additive[],
          resultDoc.allergenIds as Allergen[],
          resultDoc.imageUrl,
          mealInformation
        )
      );
    }
    return mealList;
  }

  /**
   * Get all meal plans of a given canteen out of the database
   * @param canteenKey Key of the canteen
   * @returns Array of meal plan objects
   */
  public async getAllMealPlansOfCanteen(canteenKey: string): Promise<MealPlan[]> {
    let collection = this._arango.getMealPlanCollection();
    let cursor = await this._arango.getDatabase().query(
      `FOR mealplan IN \`${collection.name}\` 
          FILTER mealplan.canteenId == "${canteenKey}"
          RETURN mealplan`
    );
    return cursor.all();
  }

  /**
   * Get the allergen object of a given key out of the database
   * @param _key Key of the allergen
   * @returns Allergen object of the given key
   */
  public async getAllergen(_key: string): Promise<Allergen> {
    if (await this._arango.getAllergenCollection().documentExists(_key)) {
      return await this._arango.getAllergenCollection().document(_key);
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
      let mealInformation: MealInformation = {
        normalPrice: meal.normalPrice,
        studentPrice: meal.studentPrice,
        co2PerPortion: meal.co2PerPortion,
      };
      return new Meal(meal._key, meal.name, meal.mealCategory, additives, allergens, meal.imageUrl, mealInformation);
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
