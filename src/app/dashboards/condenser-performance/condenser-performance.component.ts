import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { DateRange } from '../../widgets/date-range-picker/public-api';
import { ColumnMode, SortType, SelectionType } from '@swimlane/ngx-datatable';
import { ChillerDataGenerateService } from '../../services/dashboards/chiller-data-generate.service';
import { GreenmarkDataFetchingService } from '../../services/dashboards/greenmark-data-fetching.service';
import { GreenMarkFrequency } from '../../../enums/green-mark-frequency.enum';
import { GreenMarkChartType } from '../../../enums/green-mark-chart-type.enum';
import { DateServiceService } from 'src/app/services/date-service.service';
import { InitialService } from 'src/app/services/initial.service';
import { BehaviorSubject } from 'rxjs';
import { addChartConfiguration } from 'src/util/ChartHelper';

@Component({
  selector: 'app-condenser-performance',
  templateUrl: './condenser-performance.component.html',
  styleUrls: ['./condenser-performance.component.scss']
})
export class CondenserPerformanceComponent implements OnInit {

  today: Date;
  dateRange: DateRange;
  tabIndex: number;
  headerName = 'Condenser Performance';
  plantList: any = [];
  selectedPlant: number;
  equipmentTypeId: number;
  headerList: any = [];
  selectedHeader: number;
  chartLoading: boolean;
  tableWidth = new BehaviorSubject<any>('100%');

  columnMode = ColumnMode;
  sortType = SortType;
  selectionType = SelectionType;

  rows = [];
  condenserPerformanceChartData: any;

  constructor(
    private headerService: HeaderService,
    private dataFetchingService: GreenmarkDataFetchingService,
    private dataGenerateService: ChillerDataGenerateService,
    private configs: InitialService,
    private initialService: InitialService
  ) {
    this.headerService.setItem(this.headerName);
    this.headerService.setBoardLevel(2);

    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
    const todayDateRange = new DateRange();
    todayDateRange.end = new Date(this.today);
    todayDateRange.start = new Date(this.today);
    this.dateRange = todayDateRange;
    this.tabIndex = 0;
    this.chartLoading = true;
    dataFetchingService.getPlants().then(res => {
      this.plantList = res;
      this.selectedPlant = res[0].id;
      dataFetchingService.getEquipmentId(this.selectedPlant, this.configs.siteConfigurations.chillerData.header).then(eqTypeid => {
        this.equipmentTypeId = eqTypeid;
        dataFetchingService.getEquipments(this.selectedPlant, this.equipmentTypeId).then(headers => {
          this.headerList = headers;
          this.selectedHeader = headers[0] && headers[0].id ? headers[0].id : null;
          this.getCondenserPerformanceData();
        });
      });
    });
  }

  ngOnInit() {
    this.headerService.getChartWidth().subscribe(res => {
      this.tableWidth.next(res / 4);
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }

  dateRangedChanged() {
    this.getCondenserPerformanceData();
  }

  plantChanged(data) {
    this.selectedPlant = data.value;
    this.dataFetchingService.getEquipmentId(this.selectedPlant, this.configs.siteConfigurations.chillerData.header).then(eqTypeid => {
      this.equipmentTypeId = eqTypeid;
      this.dataFetchingService.getEquipments(this.selectedPlant, this.equipmentTypeId).then(headers => {
        this.headerList = headers;
        this.selectedHeader = headers[0] && headers[0].id ? headers[0].id : null;
        this.getCondenserPerformanceData();
      });
    });
  }

  headerChanged(data) {
    this.selectedHeader = data.value;
    this.getCondenserPerformanceData();
  }

  isDone: any = {}
  getCondenserPerformanceData() {
    this.isDone.condenserPerformanceChartData = false;
    this.chartLoading = true;
    this.dataFetchingService.fetchCondenserPerformanceData(
      this.dateRange,
      this.selectedPlant,
      this.selectedHeader,
      GreenMarkFrequency.OneMinute
      ).then(res => {
      this.condenserPerformanceChartData = this.dataGenerateService.generateCondenserPerformanceChart(res);
      this.condenserPerformanceChartData.chart = addChartConfiguration(this.condenserPerformanceChartData.chart);
      this.rows = res;
      this.chartLoading = false;
      this.isDone.condenserPerformanceChartData = true;
    });
  }

  exportToExcel() {
    this.dataFetchingService.exportChart(this.dateRange, GreenMarkFrequency.OneMinute, GreenMarkChartType.CondenserPerformance, this.selectedPlant, this.selectedHeader);
  }
}
