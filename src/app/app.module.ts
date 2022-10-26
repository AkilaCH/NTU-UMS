import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as TimeCharts from 'fusioncharts/fusioncharts.timeseries';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.carbon';
import * as ExcelExport from 'fusioncharts/fusioncharts.excelexport';
import * as Zoomscatter from 'fusioncharts/fusioncharts.zoomscatter';
import * as Zoomlinedy from 'fusioncharts/fusioncharts.zoomline';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NotifierModule } from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './widgets/header/header.component';
import { NavigatorComponent } from './widgets/navigator/navigator.component';
import { ElectricalDashboardComponent } from './dashboards/electrical-dashboard/electrical-dashboard.component';
import { WaterDashboardComponent } from './dashboards/water-dashboard/water-dashboard.component';
import { MeterTreeComponent } from './widgets/meter-tree/meter-tree.component';
import { ReportsComponent } from './widgets/reports/reports.component';
import { TrendComponent } from './widgets/trend/trend.component';
import { PieComponent } from './widgets/pie/pie.component';
import { MultiLevelPieComponent } from './widgets/multi-level-pie/multi-level-pie.component';
import { Doughnut2dComponent } from './widgets/doughnut2d/doughnut2d.component';
import { DataPointerComponent } from './widgets/data-pointer/data-pointer.component';
import { SiteElectricalDashboardComponent } from './dashboards/site-electrical-dashboard/site-electrical-dashboard.component';
import { SiteWaterDashboardComponent } from './dashboards/site-water-dashboard/site-water-dashboard.component';
import { ModalComponent } from './widgets/modal/modal.component';
import { TableComponent } from './widgets/table/table.component';
import { SideBarComponent } from './widgets/side-bar/side-bar.component';
import { OverviewComponent } from './dashboards/overview/overview.component';
import { FormsModule } from '@angular/forms';
import { IndicatorComponent } from './widgets/indicator/indicator.component';
import { Trend3dComponent } from './widgets/trend3d/trend3d.component';
import { Stackedcolumn3dlineComponent } from './widgets/stackedcolumn3dline/stackedcolumn3dline.component';
import { ChillerPlantComponent } from './dashboards/chiller-plant/chiller-plant.component';
import { ImageMapComponent } from './widgets/image-map/image-map.component';
import { GroupedTrendComponent } from './widgets/grouped-trend/grouped-trend.component';
import { DateRangePickerModule } from './widgets/date-range-picker/public-api';
import { ProfileChartComponent } from './widgets/profile-chart/profile-chart.component';
import { LinearScaleComponent } from './widgets/linear-scale/linear-scale.component';
import { MultiSeriesComponent } from './widgets/multi-series/multi-series.component';
import { RealTimeLineComponent } from './widgets/real-time-line/real-time-line.component';
import { DatePipe } from '@angular/common';
import { AlertsComponent } from './widgets/alerts/alerts.component';
import { AlertsDashboardComponent } from './dashboards/alerts-dashboard/alerts-dashboard.component';
import { SolarComponent } from './dashboards/solar/solar.component';
import { ReportsDashboardComponent } from './dashboards/reports-dashboard/reports-dashboard.component';
import { ToggleSwitchComponent } from './widgets/toggle-switch/toggle-switch.component';
import { InitialService } from './services/initial.service';
import { ChartContainerComponent } from './widgets/profile-chart-container/chart-container.component';
import { VersionComponent } from './widgets/version/version.component';
import { LinearScaleGradientComponent } from './widgets/linear-scale-gradient/linear-scale-gradient.component';
import { ElectricalGroupDashboardComponent } from './dashboards/electrical-group-dashboard/electrical-group-dashboard.component';
import { GroupEquipmentBreakdownComponent } from './widgets/group-equipment-breakdown/group-equipment-breakdown.component';
import { WaterGroupDashboardComponent } from './dashboards/water-group-dashboard/water-group-dashboard.component';
import { MeterTreeDateViewComponent } from './widgets/dynamic-date-label/meter-tree-date-view.component';
import { HttpRequestInterceptor } from 'src/util/interceptor';
import { ConfigurationTableComponent } from './widgets/configuration-table/configuration-table.component';

import { FormContainerComponent } from './widgets/form-container/form-container.component';
import { EqupmentBreakdownFilterComponent } from './widgets/equipment-breakdown-filter/equipment-breakdown-filter.component';
import { ComboBoxComponent } from './widgets/combo-box/combo-box.component';
import { InputFieldComponent } from './widgets/input-field/input-field.component';
import { EquipmentBreakdownFilterGroupComponent } from './widgets/equipment-breakdown-filter-group/equipment-breakdown-filter-group.component';
import { BreadcrumbComponent } from './widgets/breadcrumb/breadcrumb.component';
import { HtElectricalLoopDashboardComponent } from './dashboards/ht-electrical-loop-dashboard/ht-electrical-loop-dashboard.component';
import { HtElectricalSiteDashboardComponent } from './dashboards/ht-electrical-site-dashboard/ht-electrical-site-dashboard.component';
import { SubstationNavigatorComponent } from './widgets/substation-navigator/substation-navigator.component';
import { FloatingButtonComponent } from './widgets/floating-button/floating-button.component';
import { HtEquipmentBreakdownFilterComponent } from './widgets/ht-equipment-breakdown-filter/ht-equipment-breakdown-filter.component';
import { CarbonFootprintComponent } from './dashboards/carbon-footprint/carbon-footprint.component';
import { ChillerEfficiencyComponent } from './dashboards/chiller-efficiency/chiller-efficiency.component';
import { CondenserPerformanceComponent } from './dashboards/condenser-performance/condenser-performance.component';
import { ZoomlineComponent } from './widgets/zoomline/zoomline.component';
import { ZoomlinedyComponent } from './widgets/zoomlinedy/zoomlinedy.component';
import { ZoomscatterComponent } from './widgets/zoomscatter/zoomscatter.component';
import { DataTableComponent } from './widgets/data-table/data-table.component';
import { HeatBalanceComponent } from './dashboards/heat-balance/heat-balance.component';
import { ElectricalReportComponent } from './dashboards/electrical-report/electrical-report.component';
import { WaterReportComponent } from './dashboards/water-report/water-report.component';
import { ReportFormComponent } from './widgets/report-form/report-form.component';
import { ScheduleDownloadComponent } from './widgets/schedule-download/schedule-download.component';
import { AlertSummaryFilterComponent } from './widgets/alert-summary-filter/alert-summary-filter.component';
import { AlertConfigurationTableComponent } from './widgets/alert-configuration-table/alert-configuration-table.component';
import { ConfirmationBoxComponent } from './widgets/confirmation-box/confirmation-box.component';
import { AlertInfoComponent } from './widgets/alert-info/alert-info.component';
import { AlertConfigurationBoxComponent } from './widgets/alert-configuration-box/alert-configuration-box.component';
import { ConfigurationsComponent } from './dashboards/configurations/configurations.component';
import { ToggleButtonComponent } from './widgets/toggle-button/toggle-button.component';
import { Line2dComponent } from './widgets/line2d/line2d.component';
import { NotificationPanelComponent } from './widgets/notification-panel/notification-panel.component';
import { BadgeIconComponent } from './widgets/badge-icon/badge-icon.component';
import { MaintainenceComponent } from './error_pages/maintainence/maintainence.component';
import { Mscolumn3dlinedyComponent } from './widgets/mscolumn3dlinedy/mscolumn3dlinedy.component';
import { ThousandSeparatorPipe } from './pipes/thousand-separator.pipe';
import { LeakageInformationComponent } from './widgets/leakage-information/leakage-information.component';
import { LdConfigurationComponent } from './widgets/ld-configuration/ld-configuration.component';
import { LdMeterSelectComponent } from './widgets/ld-meter-select/ld-meter-select.component';
import { EuiComponent } from './dashboards/eui/eui.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TariffComponent } from './widgets/tariff/tariff.component';
import { PowerMeterComponent } from './dashboards/power-meter/power-meter.component';
import { ConsumptionSummeryChartComponent } from './widgets/consumption-summery-chart/consumption-summery-chart.component';
import { MultipleSelectComponent } from './widgets/multiple-select/multiple-select.component';
import { DataPointerNoneImageComponent } from './widgets/data-pointer-non-image/data-pointer-none-image.component'
import { PrintPreviewComponent } from './widgets/print-preview/print-preview.component'
import { MonthDatePickerComponent } from './widgets/date-range-picker/lib/date-month-picker/date-month-picker.component'
import { TotalConsumptionComponent } from './widgets/total-comsumption/total-comsumption.component'
import { Multiplechart2dComponent } from './widgets/multiplechart-2d/multiplechart-2d.component'
import { ChartLoaderComponent } from './widgets/chart-loader/chart-loader.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, TimeCharts, FusionTheme, Widgets, ExcelExport, Zoomscatter, Zoomlinedy);
FusionCharts.options['creditLabel'] = false;

@NgModule({
  declarations: [
    ChartLoaderComponent,
    Multiplechart2dComponent,
    TotalConsumptionComponent,
    PrintPreviewComponent,
    MonthDatePickerComponent,
    AppComponent,
    DataPointerNoneImageComponent,
    HeaderComponent,
    NavigatorComponent,
    ElectricalDashboardComponent,
    WaterDashboardComponent,
    MeterTreeComponent,
    ReportsComponent,
    TrendComponent,
    PieComponent,
    MultiLevelPieComponent,
    Doughnut2dComponent,
    DataPointerComponent,
    SiteElectricalDashboardComponent,
    SiteWaterDashboardComponent,
    ModalComponent,
    TableComponent,
    SideBarComponent,
    OverviewComponent,
    Line2dComponent,
    IndicatorComponent,
    Trend3dComponent,
    Stackedcolumn3dlineComponent,
    ChillerPlantComponent,
    ImageMapComponent,
    GroupedTrendComponent,
    ProfileChartComponent,
    LinearScaleComponent,
    MultiSeriesComponent,
    RealTimeLineComponent,
    AlertsComponent,
    AlertsDashboardComponent,
    SolarComponent,
    ReportsDashboardComponent,
    ToggleSwitchComponent,
    ChartContainerComponent,
    ModalComponent,
    VersionComponent,
    LinearScaleGradientComponent,
    ElectricalGroupDashboardComponent,
    GroupEquipmentBreakdownComponent,
    WaterGroupDashboardComponent,
    MeterTreeDateViewComponent,
    FormContainerComponent,
    EqupmentBreakdownFilterComponent,
    ComboBoxComponent,
    InputFieldComponent,
    EquipmentBreakdownFilterGroupComponent,
    BreadcrumbComponent,
    HtElectricalLoopDashboardComponent,
    SubstationNavigatorComponent,
    HtElectricalSiteDashboardComponent,
    FloatingButtonComponent,
    HtEquipmentBreakdownFilterComponent,
    CarbonFootprintComponent,
    ChillerEfficiencyComponent,
    CondenserPerformanceComponent,
    ZoomlineComponent,
    ZoomlinedyComponent,
    ZoomscatterComponent,
    DataTableComponent,
    HeatBalanceComponent,
    ElectricalReportComponent,
    WaterReportComponent,
    ReportFormComponent,
    ScheduleDownloadComponent,
    AlertSummaryFilterComponent,
    AlertConfigurationTableComponent,
    ConfirmationBoxComponent,
    AlertInfoComponent,
    AlertConfigurationBoxComponent,
    ConfigurationsComponent,
    ConfigurationTableComponent,
    ToggleButtonComponent,
    NotificationPanelComponent,
    BadgeIconComponent,
    MaintainenceComponent,
    Mscolumn3dlinedyComponent,
    ThousandSeparatorPipe,
    LeakageInformationComponent,
    LdConfigurationComponent,
    LdMeterSelectComponent,
    EuiComponent,
    TariffComponent,
    PowerMeterComponent,
    ConsumptionSummeryChartComponent,
    MultipleSelectComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FusionChartsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    DateRangePickerModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 8
        },
        vertical: {
          position: 'top',
          distance: 78,
          gap: 10
        }
      },
      behaviour: {
        stacking: 1,
        autoHide: 5000
      }
    })
  ],
  exports: [
    FontAwesomeModule
  ],
  providers: [
    Title,
    DatePipe,
    ThousandSeparatorPipe,
    InitialService,
    { 
      provide: APP_INITIALIZER, 
      useFactory: (initService: InitialService) => () => initService.load(), 
      deps: [InitialService],
      multi: true 
    },
    {
      provide   : HTTP_INTERCEPTORS,
      useClass  : HttpRequestInterceptor,
      multi     : true
    },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    NavigatorComponent,
    VersionComponent,
    SubstationNavigatorComponent,
    AlertInfoComponent,
    AlertConfigurationBoxComponent,
    ConfirmationBoxComponent,
    LeakageInformationComponent,
    LdMeterSelectComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }