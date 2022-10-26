import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentBreakdownFilterGroupComponent } from './equipment-breakdown-filter-group.component';

describe('EquipmentBreakdownFilterGroupComponent', () => {
  let component: EquipmentBreakdownFilterGroupComponent;
  let fixture: ComponentFixture<EquipmentBreakdownFilterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentBreakdownFilterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentBreakdownFilterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
