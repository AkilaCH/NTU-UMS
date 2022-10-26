import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqupmentBreakdownFilterComponent } from './equipment-breakdown-filter.component';

describe('EqupmentBreakdownFilterComponent', () => {
  let component: EqupmentBreakdownFilterComponent;
  let fixture: ComponentFixture<EqupmentBreakdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqupmentBreakdownFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqupmentBreakdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
