import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSummaryFilterComponent } from './alert-summary-filter.component';

describe('AlertSummaryFilterComponent', () => {
  let component: AlertSummaryFilterComponent;
  let fixture: ComponentFixture<AlertSummaryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertSummaryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertSummaryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
