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
import { addChartConfiguration, convertStringToArr, getChartMinMax, reduceDataChart } from '../../../util/ChartHelper';

@Component({
  selector: 'app-chiller-efficiency',
  templateUrl: './chiller-efficiency.component.html',
  styleUrls: ['./chiller-efficiency.component.scss']
})
export class ChillerEfficiencyComponent implements OnInit {

  today: Date;
  dateRange: DateRange;
  tabIndex: number;
  headerName = 'Chiller Efficiency';
  plantList: any = [];
  selectedPlant: number;
  equipmentTypeId: number;
  chillerList: any = [];
  selectedChiller: number;
  chartLoading: boolean;
  tableWidth = new BehaviorSubject<any>('100%');

  columnMode = ColumnMode;
  sortType = SortType;
  selectionType = SelectionType;

  rows = [];
  chillerEfficiencyChartData: any;
  scaleList: Array<any> = [{name: 'Fixed Scale', id: 1}, {name: 'Auto Scale', id: 2}];
  scaleListSelected: number = 1;

  constructor(
    private headerService: HeaderService,
    private dataFetchingService: GreenmarkDataFetchingService,
    private dataGenerateService: ChillerDataGenerateService,
    private configs: InitialService,
    private dateService: DateServiceService,
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
      dataFetchingService.getEquipmentId(this.selectedPlant, this.configs.siteConfigurations.chillerData.chiller).then(eqTypeid => {
        this.equipmentTypeId = eqTypeid;
        dataFetchingService.getEquipments(this.selectedPlant, this.equipmentTypeId).then(chillers => {
          this.chillerList = chillers;
          this.selectedChiller = 0;
          this.getChillerEfficiencyData();
        });
      });
    });
  }

  ngOnInit() {
    this.headerService.getChartWidth().subscribe(res => {
      this.tableWidth.next(res / 2);
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }

  dateRangedChanged() {
    this.getChillerEfficiencyData();
  }

  plantChanged(data) {
    this.selectedPlant = data.value;
    this.dataFetchingService.getEquipmentId(this.selectedPlant, this.configs.siteConfigurations.chillerData.chiller).then(eqTypeid => {
      this.equipmentTypeId = eqTypeid;
      this.dataFetchingService.getEquipments(this.selectedPlant, this.equipmentTypeId).then(chillers => {
        this.chillerList = chillers;
        this.selectedChiller = 0;
        this.getChillerEfficiencyData();
      });
    });
  }

  chillerChanged(data) {
    this.selectedChiller = data.value;
    this.getChillerEfficiencyData();
  }
  
  isDone: any = {}
  getChillerEfficiencyData() {
    this.chartLoading = true;
    let dataSource: any =  this.chillerEfficiencyChartData;
    this.isDone.chillerEfficiencyChartData = false;
    this.dataFetchingService.fetchChillerEfficiencyData(
      this.dateRange,
      this.selectedPlant,
      this.selectedChiller,
      GreenMarkFrequency.OneMinute
      ).then(res => {
      dataSource = this.dataGenerateService.generateChillerEfficiencyChart(res, this.dateRange);
      dataSource.datasetTemp = JSON.parse(JSON.stringify(dataSource.dataset));
      dataSource.chart = addChartConfiguration(dataSource.chart, true);
      let { dataset } = dataSource;
      for (let i = 0; i < dataset.length; i++) {
        dataset[i].tempColor = "00ff00";
        dataset[i] = {
          ...dataset[i],
          data: convertStringToArr(dataset[i].data, dataset[i].tempColor),
          color: '#000000',
        }
      }
      
      dataSource.dataset = dataset;
      this.chillerEfficiencyChartData = dataSource;
      this.rows = res;
      this.chartLoading = false;
      this.setMaxYAxis(this.scaleListSelected);
      this.isDone.chillerEfficiencyChartData = true;
    });
  }

  exportToExcel() {
    this.dataFetchingService.exportChart(this.dateRange, GreenMarkFrequency.OneMinute, GreenMarkChartType.ChillerEfficiency, this.selectedPlant, this.selectedChiller);
  }

  
  scaleChanged({value}) {
    this.scaleListSelected = value;
    this.setMaxYAxis(this.scaleListSelected);
  }
  
  setMaxYAxis(value) {
    if(this.chillerEfficiencyChartData.chart && value){
      if(value == 1){
        this.chillerEfficiencyChartData.chart.yAxisMinValue = 0;
        this.chillerEfficiencyChartData.chart.yAxisMaxValue = 2;
        const { dataset } = this.chillerEfficiencyChartData;
        for (let i = 0; i < dataset.length; i++) {
          let { data = '', seriesname, color } = dataset[i];
          data  = reduceDataChart(data, this.chillerEfficiencyChartData.chart.yAxisMinValue, this.chillerEfficiencyChartData.chart.yAxisMaxValue);
          this.chillerEfficiencyChartData.dataset = [{data, seriesname, color}];
        }
      }else{
        let { dataset = [] } = this.chillerEfficiencyChartData;
        if(dataset.length > 0){
          dataset = dataset[0];
          let { max, min } = getChartMinMax(dataset, 'value');
          if(min) min = min.toFixed(1);
          if(max) max = max.toFixed(1);
          this.chillerEfficiencyChartData.chart.yAxisMinValue = min || undefined;
          this.chillerEfficiencyChartData.chart.yAxisMaxValue = max || undefined;
          this.chillerEfficiencyChartData.dataset = this.chillerEfficiencyChartData.datasetTemp;
        }
      }
    }    
  }

}
