import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearScaleGradientComponent } from './linear-scale-gradient.component';

describe('LinearScaleGradientComponent', () => {
  let component: LinearScaleGradientComponent;
  let fixture: ComponentFixture<LinearScaleGradientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearScaleGradientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearScaleGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
