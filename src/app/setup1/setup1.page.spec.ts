import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Setup1Page } from './setup1.page';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { EventAggregatorService } from '../services/event-aggregator.service';

describe('Setup1Page', () => {
  let component: Setup1Page;
  let fixture: ComponentFixture<Setup1Page>;
  let eventAggregatorService: EventAggregatorService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), RouterModule.forRoot([])],
      providers: [Storage],
    }).compileComponents();

    eventAggregatorService = TestBed.inject(EventAggregatorService);
    eventAggregatorService.appStarted.next(true);
    fixture = TestBed.createComponent(Setup1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to startup if app not started', () => {
    eventAggregatorService.appStarted.next(false);
    let router = TestBed.inject(Router);
    let navigatedSpy = spyOn(router, 'navigate');
    component.ngOnInit();
    expect(navigatedSpy).toHaveBeenCalledWith(['']);
    eventAggregatorService.appStarted.next(true);
  });

  it('should update canteens if empty', async () => {
    component.canteens = [];
    let storageService = TestBed.inject(StorageService);
    let getCanteensSpy = spyOn(storageService, 'getCanteens').and.returnValue(Promise.resolve([]));
    component.ngOnInit();
    await fixture.whenStable();
    expect(getCanteensSpy).toHaveBeenCalled();
  });

  it('should set favorite canteen on select change', () => {
    let storageService = TestBed.inject(StorageService);
    let setFavoriteSpy = spyOn(storageService, 'setFavorite');
    let eventTarget = { value: 'test' };
    component.onSelectChange(eventTarget);
    expect(setFavoriteSpy).toHaveBeenCalledWith('test');
  });
});
