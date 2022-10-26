import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstationNavigatorComponent } from './substation-navigator.component';

describe('SubstationNavigatorComponent', () => {
  let component: SubstationNavigatorComponent;
  let fixture: ComponentFixture<SubstationNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstationNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstationNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
