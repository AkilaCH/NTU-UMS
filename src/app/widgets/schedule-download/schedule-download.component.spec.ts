import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDownloadComponent } from './schedule-download.component';

describe('ScheduleDownloadComponent', () => {
  let component: ScheduleDownloadComponent;
  let fixture: ComponentFixture<ScheduleDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
