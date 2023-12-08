import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Setup2Page } from './setup2.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { EventAggregatorService } from '../services/event-aggregator.service';

describe('Setup2Page', () => {
  let component: Setup2Page;
  let fixture: ComponentFixture<Setup2Page>;
  let eventAggregatorService: EventAggregatorService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [Storage],
    }).compileComponents();

    eventAggregatorService = TestBed.inject(EventAggregatorService);
    eventAggregatorService.appStarted.next(true);
    fixture = TestBed.createComponent(Setup2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to main page if app not started', async () => {
    eventAggregatorService.appStarted.next(false);
    let router = TestBed.inject(Router);
    let navigateSpy = spyOn(router, 'navigate');
    router.navigated = false;
    component.ngOnInit();
    eventAggregatorService.appStarted.next(true);
    await fixture.whenStable();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
