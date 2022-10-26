import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChillerEfficiencyComponent } from './chiller-efficiency.component';

describe('ChillerEfficiencyComponent', () => {
  let component: ChillerEfficiencyComponent;
  let fixture: ComponentFixture<ChillerEfficiencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChillerEfficiencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChillerEfficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
