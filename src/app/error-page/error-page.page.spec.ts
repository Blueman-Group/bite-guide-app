import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPagePage } from './error-page.page';
import { RouterModule } from '@angular/router';

describe('ErrorPagePage', () => {
  let component: ErrorPagePage;
  let fixture: ComponentFixture<ErrorPagePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RouterModule.forRoot([])] }).compileComponents();
    fixture = TestBed.createComponent(ErrorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
