import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatBalanceComponent } from './heat-balance.component';

describe('HeatBalanceComponent', () => {
  let component: HeatBalanceComponent;
  let fixture: ComponentFixture<HeatBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
