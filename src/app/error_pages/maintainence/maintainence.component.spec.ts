import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainenceComponent } from './maintainence.component';

describe('MaintainenceComponent', () => {
  let component: MaintainenceComponent;
  let fixture: ComponentFixture<MaintainenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
