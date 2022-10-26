import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtElectricalSiteDashboardComponent } from './ht-electrical-site-dashboard.component';

describe('HtElectricalSiteDashboardComponent', () => {
  let component: HtElectricalSiteDashboardComponent;
  let fixture: ComponentFixture<HtElectricalSiteDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtElectricalSiteDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtElectricalSiteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
