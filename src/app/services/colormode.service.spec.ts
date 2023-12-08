import { TestBed } from '@angular/core/testing';

import { ColorModeService } from './colormode.service';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('ColormodeService', () => {
  let service: ColorModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService, Storage],
    });
    service = TestBed.inject(ColorModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize dark mode if stored in storage', async () => {
    const storageService = TestBed.inject(StorageService);
    spyOn(storageService, 'getColorMode').and.returnValue(Promise.resolve('dark'));
    spyOn(service, 'initializeDarkMode');
    await service.init();
    expect(storageService.getColorMode).toHaveBeenCalled();
    expect(service.initializeDarkMode).toHaveBeenCalledWith(true);
  });

  it('should toggle dark mode', () => {
    spyOn(document.body.classList, 'toggle');
    spyOn(document.body.classList, 'contains').and.returnValue(true);
    service.toggleDarkMode();
    expect(document.body.classList.toggle).toHaveBeenCalledWith('dark');
    expect(document.body.classList.contains).toHaveBeenCalledWith('dark');
    expect(service.darkMode).toBeTrue();
  });
});
