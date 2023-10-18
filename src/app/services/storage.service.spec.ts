import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';
import { StorageCanteen } from '../interfaces/storage-canteen';

describe('StorageService', () => {
  let service: StorageService;
  let testStorageCanteen: StorageCanteen;
  let testMenu = {
    date: '2020-01-01',
    meals: [],
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [Storage],
    });
    service = TestBed.inject(StorageService);
    await service.init();
    service._storage?.clear();
    testStorageCanteen = {
      canteen: {
        _key: 'test',
        name: 'Test',
      },
      menu: [],
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if canteen exists', async () => {
    await service._storage?.set('test', 'test');
    expect(await service.checkCanteen('test')).toBeTruthy();
  });

  it('should get a canteen', async () => {
    await service._storage?.set('test', testStorageCanteen);
    expect(await service.getCanteen('test')).toEqual(testStorageCanteen);
  });

  it('should set a canteen', async () => {
    await service.setCanteen('test', testStorageCanteen);
    expect(await service._storage?.get('test')).toEqual(testStorageCanteen);
  });

  it('should get the list of canteens saved in storage', async () => {
    await service._storage?.set('test', testStorageCanteen);
    expect(await service.getCanteens()).toEqual([testStorageCanteen.canteen]);
  });

  it('should add a menu to a non existing canteen', async () => {
    const storage = service._storage;
    if (storage) {
      await service.addMenu(testStorageCanteen.canteen, testMenu);
      const storedCanteen = await storage.get('test');
      if (storedCanteen) {
        expect(storedCanteen.menu).toEqual([testMenu]);
      }
    }
  });

  it('should add a menu to an existing canteen', async () => {
    const storage = service._storage;
    if (storage) {
      await storage.set('test', testStorageCanteen);
      await service.addMenu(testStorageCanteen.canteen, testMenu);
      const storedCanteen = await storage.get('test');
      if (storedCanteen) {
        expect(storedCanteen.menu).toEqual([testMenu]);
      }
    }
  });
});
