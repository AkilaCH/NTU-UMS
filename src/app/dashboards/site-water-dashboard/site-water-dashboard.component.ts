import ChartGroupType from 'src/enums/ChartGroupType';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import {HttpService} from './../../services/http.service';
import {Component, OnInit, OnDestroy } from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {DatePipe} from '@angular/common';
import {DateServiceService} from 'src/app/services/date-service.service';
import {InitialService} from 'src/app/services/initial.service';
import {Subscription} from 'rxjs';
import {ServiceType} from '../../../enums/ServiceType';
import {DashboardType} from 'src/enums/DashboardType';
import { ActivatedRoute } from '@angular/router';
import {chartTitle, dateGapGenerator, fixDecimalNumPrecision} from '../../../util/ChartHelper';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import { ChartColorMap, ChartColorMapType } from 'src/enums/chart-color-map';
import { LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';

@Component({
  selector: 'app-site-water-dashboard',
  templateUrl: './site-water-dashboard.component.html',
  styleUrls: ['./site-water-dashboard.component.scss']
})
export class SiteWaterDashboardComponent implements OnInit, OnDestroy  {
  tabIndex = 0;
  private subscriptions: Subscription[] = [];
  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;

  dailyConsumptionData: any = {};

  trendLogData: any = {};

  equipDistribution: object = {};

  today: Date;

  overollConsumptionRange: DateRange;

  equipmentBreakdownDateRange: DateRange;

  overollConsumptionData: any;

  serviceTypeId: number;

  equipmentDistRange: DateRange;

  todayDateRange: DateRange;

  thisWeekDateRange: DateRange;

  thisMonthRange: DateRange;

  thisYearRange: DateRange;

  lastFiveYearRange: DateRange;

  loaderArray: any[] =[];
  colorMap: ChartColorMapType = ChartColorMap;

  rows = [];
  columns = [
    {name: 'Category', key: 'category'},
    {name: 'Building', key: 'building'},
    {name: 'Total Number of Meters', key: 'noOfMeters'},
    {name: 'Total Consumption (m<sup>3</sup>)', key: 'consumption'}
  ];
  tableLoading = true;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private route: ActivatedRoute,
    private ltDashboardService: LtDashboardService
  ) {

    this.dataService.get(this.configs.endPoints.site, { siteId: 1 }).subscribe(data => {
      this.headerService.setItem(data.siteName);
    },
      error => {
        this.headerService.setItem('Site Name');
      });

    if(this.initialService.getDemoConfig().isDemo){
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = dateGapGenerator(new Date(), 1, 'day', 'minus' );
    }

    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = this.dateService.getLastDaysRange(this.today, 7, 'days');
    this.thisMonthRange = this.dateService.getLastDaysRange(this.today, 30, 'days');
    this.thisYearRange = this.dateService.getLastDaysRange(this.today, 12, 'months');

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.overollConsumptionRange = this.dateService.thisMonthUpToNow(this.today);

    this.equipmentDistRange = this.dateService.thisMonthUpToNow(this.today);

    this.equipmentBreakdownDateRange = this.dateService.getTodayUpToNow(this.today);

    this.dataService.serviceTypeId.subscribe(data => {
      this.serviceTypeId = data;
    });

    this.route.data.subscribe(data => {
      this.headerService.electricalDashboardType.next(DashboardType.WATER);
    });
  }

  ngOnInit() {
    this.headerService.setBoardLevel(1);
    this.dataService.setserviceTypeId(2);

    this.getOverollConsumptionData();
    this.getTrendDaylyData();
    this.initialService.navigationStore.buildingCategories$.subscribe(res=>{
      if(res !== null && res.length !== 0) {
        this.getEqDistribution();
      }
    });
    this.onChangeTrendLogByDate()
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    if (index === 1 && this.rows.length === 0) {
      this.getEquipmentBreakDown();
    }
  }

  generateTrendDaylyData(){
    var time0 = new Date().setHours(0, 0, 0, 0);
    let labelAndValue = [];
    for (let i = 0; i < 48; i++) {
      labelAndValue.push({"label": this.datePipe.transform(time0, 'HH:mm'), "value": null});
      time0 = new Date(time0).setTime(new Date(time0).getTime() + 30*60*1000);
    }
    let data = [
      {
        "name": "Nanyang Technological University",
        "data": labelAndValue
      }
    ];
    return data;
  }

  getTrendDaylyData(dateKey: string = '_todayConsumptionDate') {
    this.isDone.dailyConsumptionData = false;
    this.dailyConsumptionData = this.ltDashboardService.getTodaysConsumptionEmptyChart(ChartDashboardType.SITE_WATER);
    this.ltDashboardService.getSiteTodaysConsumption(ServiceType.MAIN_WATER, this[dateKey].start, this[dateKey].end, ChartDashboardType.SITE_WATER).then(res=>{
      this.dailyConsumptionData = res;
      this.dailyConsumptionData.chart["paletteColors"] = [this.colorMap.water.secondary];
      this.isDone.dailyConsumptionData =  true;
    })
  }

  getEqDistribution(){
    this.isDone.equipDistribution = false;
    this.ltDashboardService.getSiteEquipmentDistribution(
      ServiceType.MAIN_WATER,
      this.equipmentDistRange.start,
      this.equipmentDistRange.end,
      ChartDashboardType.SITE_WATER,
      ChartGroupType.BUILDING_CATEGORY
    ).then(res=>{
      this.equipDistribution  = res;
      this.isDone.equipDistribution = true;
    });
  }

  errHandleEqDist(){
    let chart = {...this.configs.chartConfigurations["eq-distribution"]};
    this.equipDistribution = {
      chart: chart,
      data: {}
    };
  }

  getDate(date){
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();
    const year = new Date(date).getFullYear();
    return `${year}/${month}/${day}`
  }


  _startDateTrendLog: DateRange = {
    start: dateGapGenerator(new Date(), 1, 'day', 'minus' ),
    end: dateGapGenerator(new Date(), 1, 'day', 'minus' )
  }
  _mapArrayTrendIndex: Array<any> = LIST_DAY_CONSUMPTION;
  _isFirstInit:boolean = true;
  _maxDate = dateGapGenerator(new Date(), 1, 'day', 'minus' )
  _isYear: any = null;
  _isMonth: any = null;
  onChangeTrendLogByDate(isInit: boolean = false){
    const { month, date, year, target} = this._mapArrayTrendIndex[this.trendLogTabIndex];
    this._isYear = year;
    this._isMonth = month;
    const{ start, end } = this._startDateTrendLog;
    let newStart = new Date(start); 
    let newEnd = new Date(end);
    if(isInit){ this._isFirstInit = false }
    if(this._isFirstInit){
      const currentDate = new Date(start);
      let newDate = this._maxDate.getDate();
      let newMonth = this._maxDate.getMonth();
      if(year || month){
        newDate = 1;
        if(year){
          newMonth = 0;
        }
      }
      currentDate.setDate(newDate);
      currentDate.setMonth(newMonth);
      newEnd.setDate(newDate);
      newEnd.setMonth(newMonth);
      newStart = dateGapGenerator(currentDate, month || date || year, target, 'minus' );
      this._startDateTrendLog.end = newEnd;
      this._startDateTrendLog.start = newEnd;
    }else{
      if(date){
        newStart.setDate(end.getDate() - date);
      }else if(month){
        newStart.setMonth(end.getMonth() - month);
        newStart.setDate(1);
      }else if(year){
        newStart.setFullYear(end.getFullYear() - year);
        newStart.setMonth(0);
      }
    }
    if(date){
      newEnd = dateGapGenerator(newEnd, 1, 'day');
    }
    this.getTrendLogs(this.trendLogTabIndex+1, this.getDate(newStart), this.getDate(newEnd))
    this.resetTime()
  }

  setTrendLogData(index: number) {
    this.trendLogTabIndex = index;
    this.onChangeTrendLogByDate()
  }

  getEquipmentBreakDown() {
    this.tableLoading = true;
    this.ltDashboardService.getSiteEquipmentBreakdown(
      ServiceType.MAIN_WATER,
      this.equipmentBreakdownDateRange
    ).then(res => {
      this.rows = res;
      this.tableLoading = false;
    });
  }

  loaderSwitcher(){
    for(let i=0; i<this.loaderArray.length; i++){
      if(this.loaderArray[i]){
        this.loaderArray[i] = !this.loaderArray[i];
        break;
      }
    }

    let load = true;
    this.loaderArray.forEach((data)=>{
      if(data){
        load = true;
        return;
      } else {
        load = false;
      }
    });

    if(!load){
      this.tableLoading = false;
    }
  }

  generateTrendLogsForMonth(){
    var numberOfDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    let labelAndValues = [];

    for (let num = 1; num <= numberOfDays; num++) {
      labelAndValues.push({"label": num.toString(), "value": null});
    }

    let data = [
      {
        "name": "Nanyang Technological University",
        "data": labelAndValues
      }
    ];
    return data;
  }

  generateTrendLogsForYears(){
    let labelAndValues = [];
    for (let i = 0; i < 12; i++) {
      labelAndValues.push({"label": this.datePipe.transform(new Date().setMonth(i), 'MMM'), "value":  null})
    }

    let data = [
      {
        "name": "Nanyang Technological University",
        "data": labelAndValues
      }
    ];

    return data;
  }

  generateTrendLogsFor5Year(){
    let labelAndValue = [];
    for (let i = 4; i >= 0; i--) {
      labelAndValue.push( {"label": this.datePipe.transform(new Date().setFullYear(new Date().getFullYear() - i), 'yyyy'), "value": null})
    }
    let data = [
      {
        "name": "Nanyang Technological University",
        "data": labelAndValue
      }
    ]
    return data;
  }

  getTrendLogs(interval, from, to) {
    // TODO: load empty chart chart
    // this.trendLogData = this.ltDashboardService.getEmptyConsumptionChart(ServiceType.WATER, interval);
    this.isDone.trendLogData = false;
    this.ltDashboardService.getSiteConsumptionChart(ServiceType.MAIN_WATER, from, to, interval).then(res=>{
      this.trendLogData = res;
      
      this.trendLogData.chart["paletteColors"] = [this.colorMap.water.secondary];
      this.isDone.trendLogData = true;
    });
  }

  isDone: any = {};
  getOverollConsumptionData () {
    this.isDone.overollConsumptionData =  false;
    this.ltDashboardService.getOverallConsumptionSite(ServiceType.MAIN_WATER, this.overollConsumptionRange.start, this.overollConsumptionRange.end)
    .then(res=>{
      this.overollConsumptionData = fixDecimalNumPrecision(res, 2);
      this.isDone.overollConsumptionData = true;
    })
  }

  equiDistributionChanged() {
    this.resetTime();
    this.getEqDistribution();
  }

  overollConsuptionChanged () {
    this.getOverollConsumptionData();
    this.resetTime();
  }

  unsubscribeCalls(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy(){
    this.unsubscribeCalls();
  }

  _reload: boolean = true;
  resetTime(){
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
  }

  _todayConsumptionDate: DateRange = {
    start: new Date(),
    end: new Date()
  };
  _maxTodayConsumptionDate = new Date()
  _minTodayConsumptionDate = new Date((new Date()).setDate(new Date().getDate() - 7))
  onChangeTodayConsumption = () => {
    this._todayConsumptionDate.end = this._todayConsumptionDate.start;
    this.todayDateRange = this._todayConsumptionDate;
    this.getTrendDaylyData('_todayConsumptionDate')
  }
}
