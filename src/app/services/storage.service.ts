import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { Canteen } from '../interfaces/canteen';
import { Meal } from '../classes/meal';
import { DatabaseService } from './database.service';
import { HistoryMeal } from '../classes/history';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  _storageReady = false;

  getStorage(): Storage | null {
    return this._storage;
  }

  //inject Storage and DatabaseService and init device storage
  constructor(private storage: Storage, private databaseService: DatabaseService) {
    this.init();
  }

  /**init storage on device with create methode and check if it is ready*/
  async init() {
    this._storage = await this.storage.create();
    await this._storage.set('readyTest', 'ready');
    if ((await this._storage.get('readyTest')) === 'ready') {
      this._storageReady = true;
      await this._storage.remove('readyTest');
    }
  }

  /**
   * Check if app was setup
   * @returns true if app was setup
   */
  async checkSetup(): Promise<boolean> {
    return await this._storage?.get('setup');
  }

  /**
   * Set setup to true if app was setup
   */
  async setSetup(): Promise<void> {
    await this._storage?.set('setup', true);
  }

  /**
   * Check if canteen exists in storage
   * @param key Canteen key
   * @returns true if canteen exists in storage
   */
  async checkCanteen(key: string): Promise<boolean> {
    const canteen = await this._storage?.get(key);
    return canteen;
  }

  async checkHistory(): Promise<boolean> {
    const history = await this._storage?.get('history');

    return history;
  }
  async setHistory() {
    await this._storage?.set('history', {});
  }

  /**
   * Get canteen object from storage
   * @param key Canteen key
   * @returns StorageCanteen object of canteen
   */
  async getCanteen(key: string): Promise<StorageCanteen> {
    const canteen = await this._storage?.get(key);
    return canteen;
  }

  async getHistory() {
    let history = await this._storage?.get('history');
    return history;
  }

  /**
   * Set canteen object in storage with key
   * @param key Key of canteen
   * @param canteen StorageCanteen Object which should be saved under the given key
   */
  async setCanteen(key: string, canteen: StorageCanteen) {
    await this._storage?.set(key, canteen);
  }

  async setupHistory() {
    console.log(this.getHistory());
  }

  /**Get a list of all canteens saved in storage
   * @returns List of all canteens saved in storage
   */
  async getCanteens(): Promise<Canteen[]> {
    let canteens: Canteen[] = [];
    const keys = await this._storage?.keys();
    for (let key of keys ?? []) {
      if (key === 'setup') break;
      if (key === 'favorite') break;
      if (key === 'colormode') break;
      if (key === 'history') break;
      const canteen = await this.getCanteen(key);
      canteens.push(canteen.canteen);
    }
    return canteens;
  }

  /**Add a canteen to storage
   * @param key Key of storage
   * @param canteen Canteen Object to save
   */
  async addCanteen(key: string, canteen: Canteen): Promise<void> {
    await this._storage?.set(key, { canteen, menu: [] });
  }

  /**Add a menu to to the history on a specific date with the canteenkey where the meal was eaten
   * @param date Date of the meal
   * @param meal Meal Object to save
   **/

  async addMealToHistory(date: Date, meal: Meal, canteenKey: string) {
    let dateString = date.toISOString().substring(0, 10);
    let history = await this.getHistory();
    let hMeal = new HistoryMeal(meal.name, meal.normalPrice, meal.studentPrice, meal.imageUrl, canteenKey);
    let kw: number = getWeek(new Date(date));
    if (history[kw] == undefined) {
      history[kw] = {};
    }
    if (history[kw][dateString] == undefined) {
      history[kw][dateString] = {};
    }
    //add hmeal to history with key meal._key
    history[kw][dateString][meal._key] = hMeal;
    await this._storage?.set('history', history);
    console.log(history);

    //set the pinnedkey to true for the canteenkey in the storage
    let storageCanteen = await this.getCanteen(canteenKey);
    for (let menu of storageCanteen.menu) {
      for (let i of menu.meals) {
        if (i._key == meal._key) {
          meal.pinned = true;
        }
      }
    }
    await this.setCanteen(canteenKey, storageCanteen);
  }

  async deleteMealFromHistory(date: Date, meal_key: string, canteenKey: string) {
    let history = await this.getHistory();
    //delete meal from history using the date where you get the week from and key
    let kw: number = getWeek(new Date(date));
    let dateString = date.toISOString().substring(0, 10);
    delete history[kw][dateString][meal_key];
    await this._storage?.set('history', history);
    //set the pinnedkey to false
    let storageCanteen = await this.getCanteen(canteenKey);
    //set the pinnedkey to false at the date in storageCanteen
    console.log(storageCanteen);
    console.log('deleted meal from history');
  }

  async getWeekplan(week: number) {
    const history = await this._storage?.get('history');
    let kw = week;
    console.log(history[kw]);
    return history[kw];
  }

  /**Add the menu of a canteen to storage
   * @param canteen Canteen Object in which the menu should be saved
   * @param menu Menu Object to save
   */
  async addMenu(canteen: Canteen, menu: { date: string; meals: Meal[] }): Promise<void> {
    if (!(await this.checkCanteen(canteen._key))) {
      await this.addCanteen(canteen._key, canteen);
    }

    const _storageCanteen = await this.getCanteen(canteen._key);
    _storageCanteen.menu
      .filter((m: { date: string; meals: Meal[] }) => m.date === menu.date)
      .forEach((m: { date: string; meals: Meal[] }) => _storageCanteen.menu.splice(_storageCanteen.menu.indexOf(m), 1));
    _storageCanteen.menu.push(menu);
    await this._storage?.set(canteen._key, _storageCanteen);
  }

  /**Get the menu of a canteen at a specific date
   * @param canteen Canteen Object of which the menu should be returned
   * @param date Date of which the menu should be returned
   * @returns Menu of the canteen at the specific date
   */
  async getMenu(canteen: Canteen, date: Date): Promise<Meal[]> {
    const storageCanteen = await this.getCanteen(canteen._key);
    let menu = storageCanteen.menu.find((m: { date: string; meals: Meal[] }) => m.date === date.toISOString().substring(0, 10) && m.meals.length > 0);
    if (menu) {
      return menu.meals;
    }

    let databaseMeals = await this.databaseService.getMealsAtDate(date, canteen);
    await this.addMenu(canteen, {
      date: date.toISOString().substring(0, 10),
      meals: databaseMeals,
    });
    return databaseMeals;
  }

  /**Update the menus of a specific canteen on all dates in the next 2 weeks
   * @param canteenKey Key of the canteen which should be updated
   */
  public async updateMenus(canteenKey: string): Promise<void> {
    let storageCanteen = await this.getCanteen(canteenKey);
    let today = new Date();

    if (!storageCanteen) {
      return;
    }

    storageCanteen.menu
      .filter((m: { date: string; meals: Meal[] }) => getWeek(new Date(m.date)) < getWeek(today))
      .forEach((m: { date: string; meals: Meal[] }) => {
        storageCanteen.menu.splice(storageCanteen.menu.indexOf(m), 1);
      });

    await this.setCanteen(canteenKey, storageCanteen);

    let itDate = new Date();
    let toUpdateCurrentWeek = false;
    let filteredCurrentWeek = storageCanteen.menu.filter((m: { date: string; meals: Meal[] }) => getWeek(new Date(m.date)) === getWeek(today));
    filteredCurrentWeek.forEach((m: { date: string; meals: Meal[] }) => {
      if (m.meals.length == 0) {
        toUpdateCurrentWeek = true;
      }
    });
    //if it cannot find menus for the current week or theyre not listed then update
    if (filteredCurrentWeek.length == 0 || toUpdateCurrentWeek) {
      await this._updateWeek(itDate, storageCanteen);
    }

    let toUpdateNextWeek = false;
    let filteredNextWeek = storageCanteen.menu.filter((m: { date: string; meals: Meal[] }) => getWeek(new Date(m.date)) === getWeek(today) + 1);
    filteredNextWeek.forEach((m: { date: string; meals: Meal[] }) => {
      if (m.meals.length == 0) {
        toUpdateNextWeek = true;
      }
    });

    //if it cannot find menus for the next week then update
    if (filteredCurrentWeek.length == 0 || toUpdateNextWeek) {
      setToBeginningOfNextWeek(itDate);
      await this._updateWeek(itDate, storageCanteen);
    }
  }

  /**
   * Updates the menu of a canteen on a specific week starting at the passed date
   * @param startingDateOfWeek the starting date
   * @param storageCanteen StorageCanteen Object of which the menu should be updated
   */
  private async _updateWeek(startingDateOfWeek: Date, storageCanteen: StorageCanteen) {
    let weekDate: Date = new Date(startingDateOfWeek);
    let weekNumber = getWeek(startingDateOfWeek);
    do {
      await this.getMenu(storageCanteen.canteen, weekDate);
      weekDate.setDate(weekDate.getDate() + 1);
    } while (weekNumber === getWeek(weekDate));
  }

  /**
   * Get the meal object of a canteen which are actual. Actual means that the date of the meal is not in the past
   * @param key Key of the canteen
   * @returns Array of meal objects which are actual
   */
  public async getActualMeals(key: string): Promise<{ date: string; meals: Meal[] }[]> {
    let storageCanteen = await this.getCanteen(key);
    let date = new Date();
    let menu = storageCanteen.menu.filter((m: { date: string; meals: Meal[] }) => getWeek(new Date(m.date)) <= getWeek(date));
    return menu;
  }

  /**
   * Updates the existing canteens in the local storage with the actual ones from the datbase
   */
  public async updateCanteens(): Promise<void> {
    let canteens = await this.databaseService.getCanteens();
    for (let canteen of canteens) {
      if (!(await this.checkCanteen(canteen._key))) {
        await this.addCanteen(canteen._key, canteen);
      }
    }
  }

  /**
   * Reloads all meals from the database for a specific canteen and saves them in the storage
   * @param canteenKey Key of the canteen
   * @returns a promise which resolves when the meals are reloaded
   */
  public async reloadMenuesOfCanteenFromDb(canteenKey: string): Promise<boolean> {
    if (!(await this.databaseService.checkArangoConnection())) return false;

    let canteenFromStorage: StorageCanteen = await this._storage?.get(canteenKey);
    if (!canteenFromStorage) {
      return false;
    }
    let mealPlans = await this.databaseService.getAllMealPlansOfCanteen(canteenKey);
    if (mealPlans.length > 0) {
      canteenFromStorage.menu = []; // clear menu of canteen
      // add meal plans to menu
      for (let mealPlan of mealPlans) {
        let meals: Meal[] = mealPlan.mealIds == undefined || mealPlan.mealIds.length == 0 ? [] : await this.databaseService.getMeals(mealPlan.mealIds);
        canteenFromStorage.menu.push({ date: mealPlan.date, meals: meals });
      }
      this.storage?.set(canteenKey, canteenFromStorage);
    }
    return true;
  }

  /**
   * Set the favorite canteen
   * @param key Key of the canteen
   */
  public async setFavorite(key: string): Promise<void> {
    await this._storage?.set('favorite', key);
  }

  /**
   * Get the favorite canteen
   * @returns Favorite canteen as StorageCanteen object
   */
  public async getFavoriteCanteen(): Promise<StorageCanteen> {
    return await this.getCanteen(await this._storage?.get('favorite'));
  }

  /**
   * Get the key of the favorite canteen
   * @returns Key of the favorite canteen
   */
  public async getFavoriteCanteenKey(): Promise<string> {
    return await this._storage?.get('favorite');
  }

  /**
   * Set favorite colormode of user
   * @param colorMode Color mode which is preferred by the user (dark or light)
   */
  async setColorMode(colorMode: 'dark' | 'light'): Promise<void> {
    await this._storage?.set('colormode', colorMode);
  }

  /**
   * Get the favorite colormode selected by the user
   * @returns Favorite colormode of user (dark or light)
   */
  async getColorMode(): Promise<'dark' | 'light'> {
    return await this.storage?.get('colormode');
  }
}

/**
 * A function which sets the passed date to the beginning of the week
 * @param date Date which should be set to the beginning of the week
 */
function setToWeekStart(date: Date) {
  date.setDate(date.getDate() - date.getDay() + 1);
}

/**
 * A function which sets the date to the beginning of next week
 * @param date Date which should be set to the beginning of the next week
 */
function setToBeginningOfNextWeek(date: Date) {
  date.setDate(date.getDate() - date.getDay() + 7 + 1);
}

/**
 * A function which returns the week number of the date
 * @param date Date of which the week number should be returned
 */
function getWeek(date: Date): number {
  let dowOffset = 1; //start week on monday
  let newYear = new Date(date.getFullYear(), 0, 1);
  let day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  let x;
  let daynum = Math.floor((date.getTime() - newYear.getTime() - (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
  let weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      let nYear = new Date(date.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      //if the next year starts before the middle of the week, it is week #1 of that year
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
}
