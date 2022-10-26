import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Line2dComponent } from './line2d.component';

describe('Line2dComponent', () => {
  let component: Line2dComponent;
  let fixture: ComponentFixture<Line2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Line2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Line2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
