import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpressumPage } from './impressum.page';

describe('ImpressumPage', () => {
  let component: ImpressumPage;
  let fixture: ComponentFixture<ImpressumPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ImpressumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
