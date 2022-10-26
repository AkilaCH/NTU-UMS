import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomlinedyComponent } from './zoomlinedy.component';

describe('ZoomlinedyComponent', () => {
  let component: ZoomlinedyComponent;
  let fixture: ComponentFixture<ZoomlinedyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomlinedyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomlinedyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
