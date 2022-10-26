import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomscatterComponent } from './zoomscatter.component';

describe('ZoomscatterComponent', () => {
  let component: ZoomscatterComponent;
  let fixture: ComponentFixture<ZoomscatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomscatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomscatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
