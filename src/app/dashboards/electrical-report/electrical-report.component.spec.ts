import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalReportComponent } from './electrical-report.component';

describe('ElectricalReportComponent', () => {
  let component: ElectricalReportComponent;
  let fixture: ComponentFixture<ElectricalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
