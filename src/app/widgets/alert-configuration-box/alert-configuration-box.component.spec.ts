import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertConfigurationBoxComponent } from './alert-configuration-box.component';

describe('AlertConfigurationBoxComponent', () => {
  let component: AlertConfigurationBoxComponent;
  let fixture: ComponentFixture<AlertConfigurationBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertConfigurationBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConfigurationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
