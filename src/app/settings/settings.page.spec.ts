import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to startup if not navigated', () => {
    let router = TestBed.inject(Router);
    router.navigated = false;
    let navigatedSpy = spyOn(router, 'navigate');
    component.ngOnInit();
    expect(navigatedSpy).toHaveBeenCalledWith(['']);
  });

  it('should update dark mode on toggle', async () => {
    let storageService = TestBed.inject(StorageService);
    let storageSpy = spyOn(storageService, 'setColorMode');
    let darkMode = component.colorModeService.darkMode;
    component.toggleDark();
    expect(storageSpy).toHaveBeenCalled();
    expect(darkMode).not.toEqual(component.colorModeService.darkMode);
  });
});
