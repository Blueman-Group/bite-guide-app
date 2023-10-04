import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnPlanPage } from './own-plan.page';

describe('OwnPlanPage', () => {
  let component: OwnPlanPage;
  let fixture: ComponentFixture<OwnPlanPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OwnPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
