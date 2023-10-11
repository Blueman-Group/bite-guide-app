import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { Canteen } from '../interfaces/canteen';
import { Meal } from '../classes/meal';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  _storageReady = false;

  constructor(private storage: Storage, private databaseService: DatabaseService) {
    this.init().then(() => console.log('storage service ready'));
  }

  async init() {
    this._storage = await this.storage.create();
    await this._storage.set('readyTest', 'ready');
    if ((await this._storage.get('readyTest')) === 'ready') {
      this._storageReady = true;
      await this._storage.remove('readyTest');
    }
  }

  async checkSetup(): Promise<boolean> {
    return await this._storage?.get('setup');
  }

  async setSetup(): Promise<void> {
    await this._storage?.set('setup', true);
  }

  async checkCanteen(key: string): Promise<boolean> {
    const canteen = await this._storage?.get(key);
    return canteen;
  }

  async getCanteen(key: string): Promise<StorageCanteen> {
    const canteen = await this._storage?.get(key);
    return canteen;
  }

  async setCateen(key: string, canteen: StorageCanteen) {
    await this._storage?.set(key, canteen);
  }

  async getCanteens(): Promise<Canteen[]> {
    let canteens: Canteen[] = [];
    const keys = await this._storage?.keys();
    for (let key of keys ?? []) {
      if (key === 'setup') break;
      if (key === 'favorite') break;
      if (key === 'colormode') break;
      const canteen = await this.getCanteen(key);
      canteens.push(canteen.canteen);
    }
    return canteens;
  }

  async addCanteen(key: string, canteen: Canteen): Promise<void> {
    await this._storage?.set(key, { canteen, menu: [] });
  }

  async addMenu(canteen: Canteen, menu: { date: string; meals: Meal[] }): Promise<void> {
    if (!(await this.checkCanteen(canteen._key))) {
      await this.addCanteen(canteen._key, canteen);
    }

    const _storageCanteen = await this.getCanteen(canteen._key);
    _storageCanteen.menu.push(menu);
    await this._storage?.set(canteen._key, _storageCanteen);
  }

  async getMenu(canteen: Canteen, date: Date): Promise<Meal[]> {
    const storageCanteen = await this.getCanteen(canteen._key);
    let menu = storageCanteen.menu.find((m: { date: string; meals: Meal[] }) => m.date === date.toISOString().substring(0, 10));
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

  public async updateMenus(key: string): Promise<void> {
    let storageCanteen = await this.getCanteen(key);
    let date = new Date();
    storageCanteen.menu = storageCanteen.menu.filter((m: { date: string; meals: Meal[] }) => new Date(m.date).getWeek() <= date.getWeek());

    let itDate = new Date();
    if (storageCanteen.menu.length < 10) {
      if (storageCanteen.menu.find((m: { date: string; meals: Meal[] }) => new Date(m.date).getWeek() === date.getWeek())) {
        itDate.setToNextWeek();
        for (let i = 0; i < 5; i++) {
          await this.getMenu(storageCanteen.canteen, itDate);
          itDate.setDate(itDate.getDate() + 1);
        }
      } else {
        itDate.setToCurrentWeek();
        for (let i = 0; i < 5; i++) {
          await this.getMenu(storageCanteen.canteen, itDate);
          itDate.setDate(itDate.getDate() + 1);
        }
        itDate.setToNextWeek();
        for (let i = 0; i < 5; i++) {
          await this.getMenu(storageCanteen.canteen, itDate);
          itDate.setDate(itDate.getDate() + 1);
        }
      }
    }
  }

  public async getActualMeals(key: string): Promise<{ date: string; meals: Meal[] }[]> {
    let storageCanteen = await this.getCanteen(key);
    let date = new Date();
    let menu = storageCanteen.menu.filter((m: { date: string; meals: Meal[] }) => new Date(m.date).getWeek() <= date.getWeek());
    return menu;
  }

  //a method names updateCanteens which updates the existing canteens in the local storage with the actual ones from the datbase
  public async updateCanteens(): Promise<void> {
    let canteens = await this.databaseService.getCanteens();
    for (let canteen of canteens) {
      if (!(await this.checkCanteen(canteen._key))) {
        await this.addCanteen(canteen._key, canteen);
      }
    }
  }

  public async setFavorite(key: string): Promise<void> {
    await this._storage?.set('favorite', key);
  }

  public async getFavoriteCanteen(): Promise<StorageCanteen> {
    return await this.getCanteen(await this._storage?.get('favorite'));
  }

  async setColorMode(colorMode: 'dark' | 'light'): Promise<void> {
    await this._storage?.set('colormode', colorMode);
  }

  async getColorMode(): Promise<'dark' | 'light'> {
    return await this.storage?.get('colormode');
  }
}

declare global {
  interface Date {
    getWeek(): number;
    setToNextWeek(): void;
    setToCurrentWeek(): void;
  }
}

Date.prototype.setToCurrentWeek = function () {
  //a function which sets the date to the beginning of the current week
  let day = this.getDay();
  let diff = day - 1;
  this.setDate(this.getDate() - diff);
};

Date.prototype.setToNextWeek = function () {
  //a function which sets the date to the beginning of next week
  let day = this.getDay();
  let diff = 8 - day;
  this.setDate(this.getDate() + diff);
};

Date.prototype.getWeek = function () {
  let dowOffset = 1; //start week on monday
  let newYear = new Date(this.getFullYear(), 0, 1);
  let day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  let x;
  let daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  let weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      let nYear = new Date(this.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};
