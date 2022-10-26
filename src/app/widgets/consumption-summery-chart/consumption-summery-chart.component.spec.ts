import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionSummeryChartComponent } from './consumption-summery-chart.component';

describe('ConsumptionSummeryChartComponent', () => {
  let component: ConsumptionSummeryChartComponent;
  let fixture: ComponentFixture<ConsumptionSummeryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionSummeryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionSummeryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
