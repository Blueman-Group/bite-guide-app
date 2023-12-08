import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MealcardComponent } from './mealcard.component';
import { RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';

import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { StorageService } from '../services/storage.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('MealcardComponent', () => {
  let component: MealcardComponent;
  let fixture: ComponentFixture<MealcardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), IonicStorageModule.forRoot()],
      providers: [Storage],
    }).compileComponents();

    registerLocaleData(localeDe, 'de-DE', localeDeExtra);

    fixture = TestBed.createComponent(MealcardComponent);
    component = fixture.componentInstance;
    component.date = new Date().toDateString().substring(0, 10);
    component.meal = {
      _key: 'test',
      name: 'test',
      mealCategory: 'test',
      normalPrice: 1,
      studentPrice: 0,
      co2ClassInfo: 'test',
      co2PerPortion: 1,
      additives: [{ description: 'test', _key: 'test', identifier: 'test' }],
      allergens: [{ description: 'test', _key: 'test', identifier: 'test' }],
      imageUrl: 'test',
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
