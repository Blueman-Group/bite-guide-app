import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageCanteen } from '../interfaces/storage-canteen';
import { Canteen } from '../interfaces/canteen';
import { Meal } from '../classes/meal';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class _storageService {
  private _storage: Storage | null = null;
  _storageReady = false;

  constructor(
    private storage: Storage,
    private databaseService: DatabaseService
  ) {}

  async init() {
    this._storage = await this.storage.create();
    await this._storage.set('readyTest', 'ready');
    if ((await this._storage.get('readyTest')) === 'ready') {
      this._storageReady = true;
      await this._storage.remove('readyTest');
    }
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
}
