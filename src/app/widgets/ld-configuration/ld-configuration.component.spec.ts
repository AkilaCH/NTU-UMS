import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { ToggleButtonComponent } from '../toggle-button/toggle-button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NotifierModule } from 'angular-notifier';
import { LdConfigurationComponent } from './ld-configuration.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { AlertService } from '../../services/dashboards/alert.service';

const waterMeters = [{
  buildingGroupId: 52,
  buildingGroupName: 'South Spine',
  buildingId: 173,
  buildingName: 'SPMS',
  level: 'L2',
  levelID: 367,
  location: 'Main Meter',
  locationID: 2062,
  meterID: 7973,
  meterName: 'Main Meter',
  meterRelationship: 'SPMS',
  meterTypeID: 80,
  meterTypeName: 'Common Use',
  opcTag: 'UMS/WATER METER/SPMS/DC_172_16_12_78/Main Meter/WF',
  status: 1
}];

fdescribe('LdConfigurationComponent', () => {
  let component: LdConfigurationComponent;
  let fixture: ComponentFixture<LdConfigurationComponent>;
  let alertService: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LdConfigurationComponent,
        ComboBoxComponent,
        ToggleButtonComponent,
        FaIconComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        NgxDatatableModule,
        NotifierModule
      ],
      providers: [
        DatePipe,
        ThousandSeparatorPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alertService = TestBed.get(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display as No of rows', () => {
    const ele = fixture.debugElement.nativeElement.querySelector('.row-limit');
    expect(ele.textContent).toContain('No of Rows');
  });

  it('should isLoading, limit, tempRow, undefined and ColumnMode defined', () => {
    expect(component.isLoading).toBeUndefined();
    expect(component.meterList).toEqual([]);
    expect(component.rowLimits).toEqual([
      {id: 1, name: 10},
      {id: 2, name: 15},
      {id: 3, name: 25},
      {id: 4, name: 50},
      {id: 5, name: 100}
    ]);
    expect(component.limit).toBeUndefined();
    expect(component.ColumnMode).not.toBeUndefined();
    expect(component.tempRow).toBeUndefined();
  });

  it('should meterList defined', (done) => {
    const data = [];
    const spy = spyOn(alertService, 'getWaterMeters').and.returnValue(Promise.resolve(waterMeters));
    waterMeters.forEach(element => {
      data.push({
        id: element.meterID,
        name: element.meterName
      });
    });
    component.ngOnInit();
    spy.calls.mostRecent().returnValue.then(() => {
      expect(component.meterList).toEqual(data);
      done();
    });
  });
});
