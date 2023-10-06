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

  constructor(
    private storage: Storage,
    private databaseService: DatabaseService
  ) {
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

  async getCanteens(): Promise<Canteen[]> {
    let canteens: Canteen[] = [];
    const keys = await this._storage?.keys();
    for (let key of keys ?? []) {
      console.log(key);
      if (key === 'setup') break;
      if (key === 'favorite') break;
      const canteen = await this.getCanteen(key);
      canteens.push(canteen.canteen);
    }
    return canteens;
  }

  async addCanteen(key: string, canteen: Canteen): Promise<void> {
    await this._storage?.set(key, { canteen, menu: [] });
  }

  async addMenu(
    canteen: Canteen,
    menu: { date: string; meals: Meal[] }
  ): Promise<void> {
    if (!(await this.checkCanteen(canteen._key))) {
      await this.addCanteen(canteen._key, canteen);
    }

    const _storageCanteen = await this.getCanteen(canteen._key);
    _storageCanteen.menu.push(menu);
    await this._storage?.set(canteen._key, _storageCanteen);
  }

  async getMenu(canteen: Canteen, date: Date): Promise<Meal[]> {
    const storageCanteen = await this.getCanteen(canteen._key);
    let menu = storageCanteen.menu.find(
      (m: { date: string; meals: Meal[] }) =>
        m.date === date.toISOString().substring(0, 10)
    );
    if (menu) {
      return menu.meals;
    }

    let databaseMeals = await this.databaseService.getMealsAtDate(
      date,
      canteen
    );
    this.addMenu(canteen, {
      date: date.toISOString().substring(0, 10),
      meals: databaseMeals,
    });
    return databaseMeals;
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
    await this.storage?.set('favorite', key);
  }

  public async getFavoriteCanteen(): Promise<StorageCanteen> {
    return await this.getCanteen(await this.storage?.get('favorite'));
  }
}
