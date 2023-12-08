import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OwnMealplanPage } from './own-mealplan.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RouterModule } from '@angular/router';
import { EventAggregatorService } from '../services/event-aggregator.service';

describe('OwnMealplanPage', () => {
  let component: OwnMealplanPage;
  let fixture: ComponentFixture<OwnMealplanPage>;
  let eventAggregatorService: EventAggregatorService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), RouterModule.forRoot([])],
      providers: [Storage],
    }).compileComponents();
    eventAggregatorService = TestBed.inject(EventAggregatorService);
    eventAggregatorService.appStarted.next(true);
    fixture = TestBed.createComponent(OwnMealplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
