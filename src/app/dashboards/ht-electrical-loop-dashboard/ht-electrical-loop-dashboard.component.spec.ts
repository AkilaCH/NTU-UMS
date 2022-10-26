import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtElectricalLoopDashboardComponent } from './ht-electrical-loop-dashboard.component';

describe('HtElectricalLoopDashboardComponent', () => {
  let component: HtElectricalLoopDashboardComponent;
  let fixture: ComponentFixture<HtElectricalLoopDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtElectricalLoopDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtElectricalLoopDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
