import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpressumPage } from './impressum.page';
import { RouterModule } from '@angular/router';

describe('ImpressumPage', () => {
  let component: ImpressumPage;
  let fixture: ComponentFixture<ImpressumPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RouterModule.forRoot([])] }).compileComponents();
    fixture = TestBed.createComponent(ImpressumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
