import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondenserPerformanceComponent } from './condenser-performance.component';

describe('CondenserPerformanceComponent', () => {
  let component: CondenserPerformanceComponent;
  let fixture: ComponentFixture<CondenserPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondenserPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondenserPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
