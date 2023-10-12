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
});
