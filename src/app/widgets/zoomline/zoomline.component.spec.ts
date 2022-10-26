import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomlineComponent } from './zoomline.component';

describe('ZoomlineComponent', () => {
  let component: ZoomlineComponent;
  let fixture: ComponentFixture<ZoomlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
