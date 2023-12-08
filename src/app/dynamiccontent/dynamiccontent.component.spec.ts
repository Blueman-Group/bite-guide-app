import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DynamicContentComponent } from './dynamiccontent.component';

describe('DynamiccontentComponent', () => {
  let component: DynamicContentComponent;
  let fixture: ComponentFixture<DynamicContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicContentComponent);
    component = fixture.componentInstance;
    component.data = {};
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
