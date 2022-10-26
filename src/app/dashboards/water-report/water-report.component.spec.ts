import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterReportComponent } from './water-report.component';

describe('WaterReportComponent', () => {
  let component: WaterReportComponent;
  let fixture: ComponentFixture<WaterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
