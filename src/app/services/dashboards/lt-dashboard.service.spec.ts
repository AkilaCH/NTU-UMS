import { TestBed } from '@angular/core/testing';

import { LtDashboardService } from './lt-dashboard.service';

describe('LtDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LtDashboardService = TestBed.get(LtDashboardService);
    expect(service).toBeTruthy();
  });
});
