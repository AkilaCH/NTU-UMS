import ChartGroupType from 'src/enums/ChartGroupType';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import {HttpService} from '../../services/http.service';
import {Component, OnInit, OnDestroy } from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {DateServiceService} from 'src/app/services/date-service.service';
import {DatePipe} from '@angular/common';
import {InitialService} from 'src/app/services/initial.service';
import {Subscription} from 'rxjs';
import {ServiceType} from '../../../enums/ServiceType';
import { ActivatedRoute } from '@angular/router';
import {DashboardType} from 'src/enums/DashboardType';
import {chartTitle, dateGapGenerator, fixDecimalNumPrecision, moneyFormat} from '../../../util/ChartHelper';
import { ChartColorMap, ChartColorMapType, DevicerNumber } from 'src/enums/chart-color-map';
import { DECIMAL_MAP, LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';

@Component({
  selector: 'app-site-electrical-dashboard',
  templateUrl: './site-electrical-dashboard.component.html',
  styleUrls: ['./site-electrical-dashboard.component.scss']
})
export class SiteElectricalDashboardComponent implements OnInit, OnDestroy  {
  // 0 = overview, 1 = equipment breakdown, 3 = reports
  tabIndex = 0;

  private subscriptions: Subscription[] = [];

  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;

  dailyConsumptionData: any = {};

  trendLogData: any = {};

  equipDistribution: object = {};

  overollConsumptionData: any;

  equipmentBreakdownDateRange: DateRange;

  today: Date;

  overollConsumptionRange: DateRange;

  equipmentDistRange: DateRange;

  serviceTypeId: number;

  todayDateRange: DateRange;

  thisWeekDateRange: DateRange;

  thisMonthRange: DateRange;

  thisYearRange: DateRange;

  lastFiveYearRange: DateRange;

  loaderArray: any[] = [];

  colorMap: ChartColorMapType = ChartColorMap;
  isDone: any = {}

  rows = [];
  columns = [
    {name: 'Category', key: 'category'},
    {name: 'Building', key: 'building'},
    {name: 'Total Number of Meters', key: 'noOfMeters'},
    {name: 'Total Consumption (kWh)', key: 'consumption'}
  ];
  tableLoading: boolean;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: InitialService,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private ltDashboardService: LtDashboardService
  ) {

    this.dataService.get(this.configs.endPoints.site, { siteId: 1 }).subscribe(data => {
      this.headerService.setItem(data.siteName);
    },
      error => {
        this.headerService.setItem('Site Name');
      });

    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = dateGapGenerator(new Date(), 1, 'day', 'minus' );
    }

    this.todayDateRange = this.dateService.getToday(this.today);
    this.thisWeekDateRange = this.dateService.getLastDaysRange(this.today, 7, 'days');
    this.thisMonthRange = this.dateService.getLastDaysRange(this.today, 30, 'days');
    this.thisYearRange = this.dateService.getLastDaysRange(this.today, 12, 'months');
    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);
    this.equipmentDistRange = this.dateService.thisMonthUpToNow(this.today);
    this.overollConsumptionRange = this.dateService.thisMonthUpToNow(this.today);
    this.equipmentBreakdownDateRange = this.dateService.getTodayUpToNow(this.today);

    this.dataService.serviceTypeId.subscribe(data => {
      this.serviceTypeId = data;
    });

    this.route.data.subscribe(data => {
      this.headerService.electricalDashboardType.next(DashboardType.LOW_TENSION);
    });

  }

  ngOnInit() {

    this.headerService.setBoardLevel(0);
    this.dataService.setserviceTypeId(1);

    this.getOveralConsumptionData();
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

  plotEqDistribution(data){
    let processedData = [];
    let totalValue = 0;
    data.forEach(element => {
      totalValue += element.data[0].value;
    });
    data.forEach(element => {
      let percentage = (element.data[0].value / totalValue * 100).toFixed(2) + ' %';
      processedData.push(
        {
          displayValue: chartTitle(element.name, element.data[0].value, 'kWh', percentage, true),
          label: element.name,
          value: element.data[0].value
        }
      );
    });
    let chart = { ...this.configs.chartConfigurations["eq-distribution"] };
    this.equipDistribution = {
      chart: chart,
      data: processedData
    };
  }

  getEqDistribution() {
    this.isDone.equipDistribution = false;
    this.ltDashboardService.getSiteEquipmentDistribution(
      ServiceType.ELECTRICAL,
      this.equipmentDistRange.start,
      this.equipmentDistRange.end,
      ChartDashboardType.SITE_ELECTRICAL,
      ChartGroupType.BUILDING_CATEGORY
    ).then(res=>{
      console.log(res);
      
      this.equipDistribution  = res;
      this.isDone.equipDistribution = true;
    });
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
    this.getTrendLogs(this.trendLogTabIndex+1, this.getDate(newStart), this.getDate(newEnd));
    this.resetTime();
  }

  setTrendLogData(index: number) {
    this.trendLogTabIndex = index;
    this.onChangeTrendLogByDate()
  }



  // setTrendLogData(index: number) {
  //   switch (index) {
  //     case 0: {
  //       this.trendLogTabIndex = 0;
  //       this.getTrendLogs(1,
  //         this.datePipe.transform(
  //           this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
  //         this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'));
  //       break;
  //     }

  //     case 1: {
  //       this.trendLogTabIndex = 1;
  //       this.getTrendLogs(2,
  //         this.datePipe.transform(this.thisMonthRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisMonthRange.end, 'yyyy/MM/dd'));
  //       break;
  //     }

  //     case 2: {
  //       this.trendLogTabIndex = 2;
  //       this.thisYearRange.start.setDate(1);
  //       this.thisYearRange.end.setDate(1);
  //       this.getTrendLogs(3,
  //         this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisYearRange.end, 'yyyy/MM/dd'));
  //       break;
  //     }

  //     case 3: {
  //       this.trendLogTabIndex = 3;
  //       this.getTrendLogs(4,
  //         this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'));
  //       break;
  //     }
  //   }
  // }

  getOveralConsumptionData() {
    this.isDone.overollConsumptionData = false;
    this.ltDashboardService.getOverallConsumptionSite(ServiceType.ELECTRICAL, this.overollConsumptionRange.start, this.overollConsumptionRange.end).then(res=>{
      this.overollConsumptionData = fixDecimalNumPrecision(res, 2);
      this.isDone.overollConsumptionData = true;
    });
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
    this.dailyConsumptionData = this.ltDashboardService.getTodaysConsumptionEmptyChart(ChartDashboardType.SITE_ELECTRICAL);
    this.ltDashboardService.getSiteTodaysConsumption(ServiceType.ELECTRICAL, this[dateKey].start, this[dateKey].end, ChartDashboardType.SITE_ELECTRICAL).then(res=>{
      this.dailyConsumptionData = res;
      this.isDone.dailyConsumptionData = true;
      for (let i = 0; i < this.dailyConsumptionData.data.length; i++) {
        const item = this.dailyConsumptionData.data[i];
        const newValue = item.value / DevicerNumber.electrical
        this.dailyConsumptionData.data[i] = {
          ...item,
          value: item.value ? newValue: null,
          displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.electricalTodayConsumption)) : null,
          toolText: "Time: $label <br/> Consumption: $displayValue kWh",
        }
      }
      this.dailyConsumptionData.chart = {
        ...this.dailyConsumptionData.chart,
        formatNumberScale: 0,
        valuePosition: "outside",
        paletteColors: [this.colorMap.electric.secondary],
      }
    })
  }

  getTrendLogs(interval, from, to) {
    // TODO: load empty chart chart
    // this.trendLogData = this.ltDashboardService.getEmptyConsumptionChart(ServiceType.ELECTRICAL, interval);
    this.isDone.trendLogData = false;
    this.ltDashboardService.getSiteConsumptionChart(ServiceType.ELECTRICAL, from, to, interval).then(res=>{
      this.trendLogData = res;
      this.isDone.trendLogData = true;
      this.trendLogData.chart = {
        ...this.trendLogData.chart,
        formatNumberScale: 0,
        valuefontSize: 16,
        paletteColors: [this.colorMap.electric.secondary]
      }
    });
  }

  getEquipmentBreakDown() {
    this.tableLoading = true;
    this.ltDashboardService.getSiteEquipmentBreakdown(
      ServiceType.ELECTRICAL,
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

  overallConsumptionChanged() {
    this.resetTime();
    this.getOveralConsumptionData();
  }

  equiDistributionChanged() {
    this.resetTime();
    this.getEqDistribution();
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
