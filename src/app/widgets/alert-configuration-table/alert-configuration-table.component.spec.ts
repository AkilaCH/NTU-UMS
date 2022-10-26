import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertConfigurationTableComponent } from './alert-configuration-table.component';

describe('AlertConfigurationTableComponent', () => {
  let component: AlertConfigurationTableComponent;
  let fixture: ComponentFixture<AlertConfigurationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertConfigurationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConfigurationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
