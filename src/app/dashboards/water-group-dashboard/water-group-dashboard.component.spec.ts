import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterGroupDashboardComponent } from './water-group-dashboard.component';

describe('WaterGroupDashboardComponent', () => {
  let component: WaterGroupDashboardComponent;
  let fixture: ComponentFixture<WaterGroupDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterGroupDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterGroupDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
