import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OwnMealplanPage } from './own-mealplan.page';

describe('OwnMealplanPage', () => {
  let component: OwnMealplanPage;
  let fixture: ComponentFixture<OwnMealplanPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OwnMealplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
