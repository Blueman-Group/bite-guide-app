import { TestBed } from '@angular/core/testing';

import { EventAggregatorService } from './event-aggregator.service';

describe('EventAggregatorService', () => {
  let service: EventAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventAggregatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
