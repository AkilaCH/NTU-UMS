import { TestBed } from '@angular/core/testing';

import { ConfigurationDashboardService } from './configuration-dashboard.service';

describe('ConfigurationDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigurationDashboardService = TestBed.get(ConfigurationDashboardService);
    expect(service).toBeTruthy();
  });
});
