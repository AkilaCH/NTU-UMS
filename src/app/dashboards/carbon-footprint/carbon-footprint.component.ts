import { Component, Input, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { DateRange } from '../../widgets/date-range-picker/public-api';
import { GreenmarkDataFetchingService } from '../../services/dashboards/greenmark-data-fetching.service';
import { ChillerDataGenerateService } from './../../services/dashboards/chiller-data-generate.service';
import { ColumnMode, SortType, SelectionType } from '@swimlane/ngx-datatable';
import { GreenMarkFrequency } from '../../../enums/green-mark-frequency.enum';
import { GreenMarkChartType } from '../../../enums/green-mark-chart-type.enum';
import { DateServiceService } from 'src/app/services/date-service.service';
import { InitialService } from 'src/app/services/initial.service';
import { BehaviorSubject } from 'rxjs';
import { convertStringToArr } from 'src/util/ChartHelper';

@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrls: ['./carbon-footprint.component.scss']
})
export class CarbonFootprintComponent implements OnInit {

  today: Date =  new Date();
  dateRange: DateRange;
  tabIndex: number;
  headerName = 'Carbon Footprint';
  plantList: any = [];
  selectedPlant: number;
  chartLoading: boolean;
  tableWidth = new BehaviorSubject<any>('100%');

  columnMode = ColumnMode;
  sortType = SortType;
  selectionType = SelectionType;
  @Input() gridEmision = 0.4080;
  tempGridEmision = 0.4080;

  rows = [];
  carbonFootprintChartData: any;

  constructor(
    private headerService: HeaderService,
    private dataFetchingService: GreenmarkDataFetchingService,
    private dataGenerateService: ChillerDataGenerateService,
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

    this.dateRange = dateService.getLastDaysRange(this.today, 30, 'days');
    this.tabIndex = 0;
    this.chartLoading = true;
    dataFetchingService.getPlants().then(res => {
      this.plantList = res;
      this.selectedPlant = res[0].id;
      this.getCarbonFootprintData();
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
    this.getCarbonFootprintData();
  }

  plantChanged(data) {
    this.selectedPlant = data.value;
    this.getCarbonFootprintData();
  }

  reduceData(arr){
    const temp = [];
    for (let i = 0; i < arr.length; i++) {
      const item = {
        ...arr[i],
        anchorbgcolor: arr[i].tempColor || arr[i].color,
        anchorbordercolor: arr[i].tempColor || arr[i].color,
      };
      if(item.seriesname.toLowerCase() != 'monthly co₂ emission (kg)'){
        if(item.seriesname){
          item.seriesname = item.seriesname.replace(/\(kg\)/gi,"(kg CO₂)")
        }
        temp.push(item)
      }
    }
    return temp
  }

  isDone: any = {}
  getCarbonFootprintData() {
    this.chartLoading = true;
    this.isDone.carbonFootprintChartData = false;
    let dataSource: any = {};
    const COLOR_MAP = ["007bff", "00ff00"];
    this.dataFetchingService.fetchCarbonFootPrintData(this.dateRange, this.selectedPlant, GreenMarkFrequency.Day).then(res => {
      dataSource = this.dataGenerateService.generateCarbonFootprintChart(res, this.dateRange);
      dataSource.dataset = this.reduceData(dataSource.dataset); 
      const { dataset } = dataSource;
      for (let i = 0; i < dataset.length; i++) {
        dataset[i].tempColor = COLOR_MAP[i];
        dataset[i] = {
          ...dataset[i],
          data: convertStringToArr(dataset[i].data, dataset[i].tempColor, '|'),
          color: '#000000',
        }
      }
      
      dataSource.dataset = dataset;
      dataSource.chart = {
        ...dataSource.chart
      }
      this.carbonFootprintChartData = dataSource;
      this.rows = res;
      this.chartLoading = false;
      this.isDone.carbonFootprintChartData = true;
    });
  }

  exportToExcel() {
    this.dataFetchingService.exportChart(this.dateRange, GreenMarkFrequency.Day, GreenMarkChartType.CarbonFootPrint, this.selectedPlant);
  }


  onOpen = (key ='open') => {
    const el = document.getElementsByClassName('popup-confirm')[0];
    if(el){
      if(key === 'open'){
        el.className = 'popup-confirm show-popup'
      }else{
        el.className = 'popup-confirm'
      }
    }
    if(key === 'cancel'){
      this.gridEmision = this.tempGridEmision;
    }
  }
}
