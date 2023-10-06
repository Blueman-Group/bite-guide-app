import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Setup1Page } from './setup1.page';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { RouterModule } from '@angular/router';

describe('Setup1Page', () => {
  let component: Setup1Page;
  let fixture: ComponentFixture<Setup1Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), RouterModule.forRoot([])],
      providers: [Storage],
    }).compileComponents();

    fixture = TestBed.createComponent(Setup1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
