import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Router, RouterModule } from '@angular/router';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { registerLocaleData } from '@angular/common';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), RouterModule.forRoot([])],
      providers: [Storage],
    }).compileComponents();

    registerLocaleData(localeDe, 'de-DE', localeDeExtra);

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to main page if not navigated', () => {
    let router = TestBed.inject(Router);
    let navigateSpy = spyOn(router, 'navigate');
    router.navigated = false;
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/'], { skipLocationChange: true });
  });

  it('should select today', () => {
    component.today();
    let date = new Date();
    expect(component.selectedDate.getDate()).toBe(date.getDate());
    expect(component.selectedDate.getMonth()).toBe(date.getMonth());
    expect(component.selectedDate.getFullYear()).toBe(date.getFullYear());
  });
});
