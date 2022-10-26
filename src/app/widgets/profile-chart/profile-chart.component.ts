import { InitialService } from './../../services/initial.service';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import { Component, OnInit, Input} from '@angular/core';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import {DatePipe} from '@angular/common';
import {HttpService} from '../../services/http.service';
import {DateServiceService} from '../../services/date-service.service';

@Component({
  selector: 'app-profile-chart',
  templateUrl: './profile-chart.component.html',
  styleUrls: ['./profile-chart.component.scss']
})

export class ProfileChartComponent implements OnInit {

  @Input() serviceType: number;
  @Input() buildingId: number;
  @Input() level: String = 'building';

  today: Date;
  compare: boolean = false;
  dateRange: DateRange;
  chart = null;
  dataSource: any;
  compareDataSource: any;
  dataset: any;
  datasetCompare: any;
  week = {"Sunday" : 0, "Monday" :1, "Tuesday" : 2, "Wednesday" : 3, "Thursday" : 4, "Friday" : 5, "Saturday" : 6, "Holiday" : 7};
  allBuildings = [];

  constructor(
    private datePipe: DatePipe,
    private dataService: HttpService,
    private dateService: DateServiceService,
    private configs: InitialService,
    private ltDashboardService: LtDashboardService,
    private initialService: InitialService
  ) {}

  ngOnInit() {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
    this.dateRange = this.dateService.thisMonthUpToNow(this.today);
    this.dataset = this.configs.chartConfigurations.profileChartData;
    this.datasetCompare = this.configs.chartConfigurations.profileChartData2;
    this.chart = this.configs.chartConfigurations["profileChart"];
    this.plotEmptyChart(this.compare);
    if(this.level == 'building'){
      this.getChartData({event: this.dateRange, isCompare: true});
    } else {
      this.getChartDataGroup({event: this.dateRange, isCompare: true});
    }
  }

  compareChange(event) {
    this.compare = !this.compare;

    if(this.compare){
      if(this.level == 'building'){
        this.getChartData({event: this.dateService.thisMonthUpToNow(this.today), isCompare: false});
      } else {
        this.getChartDataGroup({event: this.dateService.thisMonthUpToNow(this.today), isCompare: false});
      }
    }
  }

  getChartDataGroup(event){

    this.ltDashboardService.getProfileChartBuildingGroup(this.serviceType ,this.buildingId, event.event.start, event.event.end ).then(res=>{
      if (event.isCompare) {
        this.dataSource = res;
      } else {
        this.compareDataSource = res;
      }
    });
  }

  getChartData (event) {

    this.ltDashboardService.getProfileChartBuilding(this.serviceType ,this.buildingId, event.event.start, event.event.end ).then(res=>{
      if (event.isCompare) {
        this.dataSource = res;
      } else {
        this.compareDataSource = res;
      }
    });
  }

  plotEmptyChart(isCompare) {
    if (isCompare) {
      this.dataSource = this.ltDashboardService.getEmptyProfileChart(this.serviceType);
    } else {
      this.compareDataSource = this.ltDashboardService.getEmptyProfileChart(this.serviceType);
    }
  }

  dateChanged(event)  {
    this.dateRange = event.event;
    this.plotEmptyChart(event.isCompare);

    if(this.level =='building'){
      this.getChartData({event: this.dateRange, isCompare: event.isCompare});
    } else {
      this.getChartDataGroup({event: this.dateRange, isCompare: event.isCompare});
    }
  }
}
