import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Setup2Page } from './setup2.page';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('Setup2Page', () => {
  let component: Setup2Page;
  let fixture: ComponentFixture<Setup2Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [Storage],
    }).compileComponents();

    fixture = TestBed.createComponent(Setup2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
