import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTreeDateViewComponent } from './meter-tree-date-view.component';

describe('MeterTreeDateViewComponent', () => {
  let component: MeterTreeDateViewComponent;
  let fixture: ComponentFixture<MeterTreeDateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterTreeDateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTreeDateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
