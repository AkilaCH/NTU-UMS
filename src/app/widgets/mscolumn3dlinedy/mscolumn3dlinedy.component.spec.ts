import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mscolumn3dlinedyComponent } from './mscolumn3dlinedy.component';

describe('Mscolumn3dlinedyComponent', () => {
  let component: Mscolumn3dlinedyComponent;
  let fixture: ComponentFixture<Mscolumn3dlinedyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mscolumn3dlinedyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mscolumn3dlinedyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
