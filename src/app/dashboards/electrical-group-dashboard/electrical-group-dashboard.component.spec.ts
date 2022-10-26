import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalGroupDashboardComponent } from './electrical-group-dashboard.component';

describe('ElectricalGroupDashboardComponent', () => {
  let component: ElectricalGroupDashboardComponent;
  let fixture: ComponentFixture<ElectricalGroupDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricalGroupDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalGroupDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
