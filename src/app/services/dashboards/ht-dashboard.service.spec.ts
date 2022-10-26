import { TestBed } from '@angular/core/testing';

import { HtDashboardService } from './ht-dashboard.service';

describe('HtDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtDashboardService = TestBed.get(HtDashboardService);
    expect(service).toBeTruthy();
  });
});
