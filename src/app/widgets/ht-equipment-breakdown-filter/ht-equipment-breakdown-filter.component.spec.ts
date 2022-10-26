import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtEquipmentBreakdownFilterComponent } from './ht-equipment-breakdown-filter.component';

describe('HtEquipmentBreakdownFilterComponent', () => {
  let component: HtEquipmentBreakdownFilterComponent;
  let fixture: ComponentFixture<HtEquipmentBreakdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtEquipmentBreakdownFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtEquipmentBreakdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
