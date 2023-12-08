import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrivacyPage } from './privacy.page';
import { RouterModule } from '@angular/router';

describe('PrivacyPage', () => {
  let component: PrivacyPage;
  let fixture: ComponentFixture<PrivacyPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RouterModule.forRoot([])] }).compileComponents();
    fixture = TestBed.createComponent(PrivacyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
