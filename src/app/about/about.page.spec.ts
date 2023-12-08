import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPage } from './about.page';
import { RouterModule } from '@angular/router';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RouterModule.forRoot([])] }).compileComponents();
    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
