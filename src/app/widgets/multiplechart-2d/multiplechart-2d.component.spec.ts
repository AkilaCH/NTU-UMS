import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Multiplechart2dComponent } from './multiplechart-2d.component';

describe('Stackedcolumn3dlineComponent', () => {
  let component: Multiplechart2dComponent;
  let fixture: ComponentFixture<Multiplechart2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Multiplechart2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Multiplechart2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
