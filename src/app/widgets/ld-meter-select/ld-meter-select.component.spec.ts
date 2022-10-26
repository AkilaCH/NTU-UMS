import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdMeterSelectComponent } from './ld-meter-select.component';

describe('LdMeterSelectComponent', () => {
  let component: LdMeterSelectComponent;
  let fixture: ComponentFixture<LdMeterSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdMeterSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdMeterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
