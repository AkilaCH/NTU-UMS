import { TestBed } from '@angular/core/testing';

import { EquipmentBreakdownStoreService } from './equipment-breakdown-store.service';

describe('EquipmentBreakdownStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipmentBreakdownStoreService = TestBed.get(EquipmentBreakdownStoreService);
    expect(service).toBeTruthy();
  });
});
