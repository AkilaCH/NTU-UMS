import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEquipmentBreakdownComponent } from './group-equipment-breakdown.component';

describe('GroupEquipmentBreakdownComponent', () => {
  let component: GroupEquipmentBreakdownComponent;
  let fixture: ComponentFixture<GroupEquipmentBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupEquipmentBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEquipmentBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
