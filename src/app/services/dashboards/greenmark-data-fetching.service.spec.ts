import { TestBed } from '@angular/core/testing';

import { GreenmarkDataFetchingService } from './greenmark-data-fetching.service';

describe('GreenmarkDataFetchingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GreenmarkDataFetchingService = TestBed.get(GreenmarkDataFetchingService);
    expect(service).toBeTruthy();
  });
});
