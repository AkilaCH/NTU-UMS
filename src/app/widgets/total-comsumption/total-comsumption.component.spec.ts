import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalConsumptionComponent } from './total-comsumption.component';

describe('TotalConsumptionComponent', () => {
  let component: TotalConsumptionComponent;
  let fixture: ComponentFixture<TotalConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
