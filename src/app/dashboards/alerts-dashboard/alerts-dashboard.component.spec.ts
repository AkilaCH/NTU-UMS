import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from 'src/app/widgets/data-table/data-table.component';
import { AlertConfigurationTableComponent } from 'src/app/widgets/alert-configuration-table/alert-configuration-table.component';
import { AlertSummaryFilterComponent } from 'src/app/widgets/alert-summary-filter/alert-summary-filter.component';
import { DateRangePickerComponent } from 'src/app/widgets/date-range-picker/public-api';
import { FormContainerComponent } from 'src/app/widgets/form-container/form-container.component';
import { InputFieldComponent } from 'src/app/widgets/input-field/input-field.component';

import { AlertsDashboardComponent } from './alerts-dashboard.component';
import { ComboBoxComponent } from 'src/app/widgets/combo-box/combo-box.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToggleButtonComponent } from 'src/app/widgets/toggle-button/toggle-button.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotifierModule } from 'angular-notifier';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';

describe('AlertsComponent', () => {
  let component: AlertsDashboardComponent;
  let fixture: ComponentFixture<AlertsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlertsDashboardComponent,
        // DateRangePickerComponent,
        InputFieldComponent,
        FormContainerComponent,
        DataTableComponent,
        AlertSummaryFilterComponent,
        AlertConfigurationTableComponent,
        ComboBoxComponent,
        ToggleButtonComponent
      ],
      imports: [
        FormsModule,
        NgxDatatableModule,
        HttpClientModule,
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
    fixture = TestBed.createComponent(AlertsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // need to comment all date-range-picker tags
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
