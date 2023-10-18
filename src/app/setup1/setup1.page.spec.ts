import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Setup1Page } from './setup1.page';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';

describe('Setup1Page', () => {
  let component: Setup1Page;
  let fixture: ComponentFixture<Setup1Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), RouterModule.forRoot([])],
      providers: [Storage],
    }).compileComponents();

    fixture = TestBed.createComponent(Setup1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to startup if not navigated', () => {
    let router = TestBed.inject(Router);
    router.navigated = false;
    let navigatedSpy = spyOn(router, 'navigate');
    component.ngOnInit();
    expect(navigatedSpy).toHaveBeenCalledWith(['']);
  });

  it('should update canteens if empty', () => {
    component.canteens = [];
    component.updating = false;
    let storageService = TestBed.inject(StorageService);
    let getCanteensSpy = spyOn(storageService, 'getCanteens').and.returnValue(Promise.resolve([]));
    component.ngAfterContentChecked();
    expect(getCanteensSpy).toHaveBeenCalled();
    expect(component.updating).toBeTrue();
  });

  it('should set favorite canteen on select change', () => {
    let storageService = TestBed.inject(StorageService);
    let setFavoriteSpy = spyOn(storageService, 'setFavorite');
    let eventTarget = { value: 'test' };
    component.onSelectChange(eventTarget);
    expect(setFavoriteSpy).toHaveBeenCalledWith('test');
  });
});
