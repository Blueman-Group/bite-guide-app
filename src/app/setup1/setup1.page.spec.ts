import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Setup1Page } from './setup1.page';

describe('Setup1Page', () => {
  let component: Setup1Page;
  let fixture: ComponentFixture<Setup1Page>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(Setup1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
