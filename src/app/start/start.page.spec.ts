import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StartPage } from './start.page';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../services/storage.service';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [StorageService, Storage],
    }).compileComponents();

    fixture = TestBed.createComponent(StartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
