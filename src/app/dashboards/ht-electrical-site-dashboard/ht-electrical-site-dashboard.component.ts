import ChartGroupType from 'src/enums/ChartGroupType';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import { Component, OnInit } from '@angular/core';
import { HtDashboardService } from '../../services/dashboards/ht-dashboard.service';
import { Subscription } from 'rxjs';
import { DateRange } from '../../../app/widgets/date-range-picker/public-api';
import { DateServiceService } from '../../../app/services/date-service.service';
import { InitialService } from '../../../app/services/initial.service';
import { DatePipe } from '@angular/common';
import { HeaderService } from '../../../app/services/header.service';
import { HttpService } from '../../../app/services/http.service';
import {DashboardType} from '../../../enums/DashboardType';
import { ActivatedRoute } from '@angular/router';
import {HTApiType} from '../../../enums/HTApiType';
import { HtCategory } from '../../../enums/HtCategory';
import { Interval } from 'src/enums/intervals';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import {chartTitle, dateGapGenerator, fixDecimalNumPrecision, moneyFormat} from '../../../util/ChartHelper';
import { ServiceType } from '../../../enums/ServiceType';
import { ChartColorMap, ChartColorMapType, DevicerNumber } from 'src/enums/chart-color-map';
import { DECIMAL_MAP, LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';

@Component({
  selector: 'app-ht-site-electrical-dashboard',
  templateUrl: './ht-electrical-site-dashboard.component.html',
  styleUrls: ['./ht-electrical-site-dashboard.component.scss']
})

export class HtElectricalSiteDashboardComponent implements OnInit {

  breakdownSubstationId = 0;

  breakdownMeterId = 0;

  breakdownLoopId = 0;

  tabIndex = 0;

  private subscriptions: Subscription[] = [];

  trendLogTabIndex = 0;

  dailyConsumptionData: any = {chart: {}};

  trendLogData: any = {};

  substationDistribution: object = {};

  substationDistributionTable = {columns: ['Name', 'Value', 'Percentage'], data: null};

  overollConsumptionData: any;

  today: Date =  new Date();

  overollConsumptionRange: DateRange;

  substationDistRange: DateRange;

  thisWeekDateRange: DateRange;

  thisMonthRange: DateRange;

  thisYearRange: DateRange;

  lastFiveYearRange: DateRange;

  todayDateRange: DateRange;

  loopList: any = [];

  substationList: any = [];

  equipmentBreakdownData: any = null;

  eqBreakDownFilter: DateRange;

  siteId: number;
  siteName: string;
  colorMap: ChartColorMapType = ChartColorMap

  rows = [];
  columns = [
    {name: 'Loop', key: 'loop'},
    {name: 'Substation', key: 'substation'},
    {name: 'Meter', key: 'meter'},
    {name: 'Tag', key: 'tag'}
  ];
  tableLoading = true;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: InitialService,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private htDashboardService: HtDashboardService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private ltDashboardService: LtDashboardService
  ) {
    this.dataService.get(this.configs.endPoints.site, { siteId: 1 })
    .subscribe(data => {
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
    this.overollConsumptionRange = this.dateService.thisMonthUpToNow(this.today);
    this.substationDistRange =  this.dateService.thisMonthUpToNow(this.today);
    this.todayDateRange = this.dateService.getToday(this.today);
    this.thisWeekDateRange = this.dateService.getLastDaysRange(this.today, 7, 'days');
    this.thisMonthRange = this.dateService.getLastDaysRange(this.today, 30, 'days');
    this.thisYearRange = this.dateService.getLastDaysRange(this.today, 12, 'months');
    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.route.data.subscribe(data => {
      this.headerService.electricalDashboardType.next(DashboardType.HIGH_TENSION);
    });

    this.headerService.setBoardLevel(0);
    this.eqBreakDownFilter = this.dateService.thisMonthUpToNow(this.today);
    this.eqBreakDownFilter.end = this.today;
    this.getOverviewDashboardData();
    this.loopDistributionChanged(0);
    this.onChangeTrendLogByDate()
    this.overollConsumptionChanged();
  }

  ngOnInit() { }

  getOverviewDashboardData(dateKey: string = '_todayConsumptionDate') {
    this.isDone.dailyConsumptionData =  false;
    this.dailyConsumptionData = this.ltDashboardService.getTodaysConsumptionEmptyChart(ChartDashboardType.SITE_ELECTRICAL);
    this.htDashboardService.getHTTrendDaylyData(
      this.datePipe.transform(this[dateKey].start, 'yyyy/MM/dd'),
      this.datePipe.transform(this[dateKey].end, 'yyyy/MM/dd'),
      HTApiType.SITE,
      this.configs.siteConfigurations.siteId,
      ServiceType.MAIN_HT_ELECTRICAL
    ).then(result=>{
      this.dailyConsumptionData = result;
      this.isDone.dailyConsumptionData =  true;
      // for (let i = 0; i < this.dailyConsumptionData.data.length; i++) {
      //   const item = this.dailyConsumptionData.data[i];
      //   const newValue = item.value / DevicerNumber.electrical
      //   this.dailyConsumptionData.data[i] = {
      //     ...item, 
      //     value: item.value ? newValue: null,
      //     displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.electricalTodayConsumption)) : null,
      //     toolText: "Time: $label <br/> Consumption: $displayValue kWh",
      //   }
      // }
      this.dailyConsumptionData.chart = {
        ...this.dailyConsumptionData.chart,
        formatNumberScale: 0,
        paletteColors: [this.colorMap.electric.secondary],
      }
    });
    // this.loopDistributionChanged(0);
    // this.onChangeTrendLogByDate()
    // this.overollConsumptionChanged();
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    switch (this.tabIndex) {
      case 0:
        this.getOverviewDashboardData();
        break;
      case 1:
        this.loopDistributionChanged(1);
        break;
      case 2:
        this.getEquipmentBreakdownData();
        break;
    }
  }

  getEquipmentBreakdownData() {
    this.htDashboardService.getSitehtBreakdownData(
      this.datePipe.transform(this.eqBreakDownFilter.start, 'yyyy/MM/dd'),
      this.datePipe.transform(this.eqBreakDownFilter.end, 'yyyy/MM/dd')
      ).then((res: any) => {
      this.equipmentBreakdownData = res;
      this.tableLoading = false;
    });
  }

  onEqBreakdownDateChange(event) {
    this.getEquipmentBreakdownData();
  }

  onEquipmentBreakdownFiltered(data) {
    this.rows = [];
    data.forEach(item => {
      this.rows.push({loop: item.loopName, substation: item.substationName, meter: item.meterName, tag: item.opcTag});
    });
    this.tableLoading = false;
  }

  isDone: any = {};
  overollConsumptionChanged() {
    this.isDone.overollConsumptionData = false;
    this.resetTime();
    this.htDashboardService.getHTOveralConsumptionData(
      this.overollConsumptionRange.start.toDateString(),
      this.overollConsumptionRange.end.toDateString(),
      HTApiType.SITE,
      this.configs.siteConfigurations.siteId,
      ServiceType.MAIN_HT_ELECTRICAL
    ).then((response) => {
      this.overollConsumptionData = fixDecimalNumPrecision(response[0].data[0].value, 2); 
      this.isDone.overollConsumptionData = true;
      
    });
  }

  loopDistributionChanged(index) {
    this.isDone.substationDistribution =  false;
    this.resetTime();
    this.htDashboardService.getSubstationDistribution(
      this.datePipe.transform(this.substationDistRange.start, 'yyyy/MM/dd'),
      this.datePipe.transform(this.substationDistRange.end, 'yyyy/MM/dd'),
      this.configs.siteConfigurations.siteId,
      HTApiType.SITE,
      HtCategory.HTLoop,
      index,
      ChartGroupType.HT_LOOPS
    ).then((response) => {
      this.substationDistribution = response;
      this.isDone.substationDistribution = true;
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
    this.callApiTrendLogData(this.trendLogTabIndex+1, this.getDate(newStart), this.getDate(newEnd));
    this.resetTime();
  }

  setTrendLogData(index: number) {
    this.trendLogTabIndex = index;
    this.onChangeTrendLogByDate()
  }

  callApiTrendLogData(interval: number, start, end){
    this.isDone.trendLogData =  false;
    this.htDashboardService.getHTTrendLogs(
      interval,
      start,
      end,
      HTApiType.SITE,
      this.configs.siteConfigurations.siteId,
      ServiceType.MAIN_HT_ELECTRICAL
    ).then((response) => {
      this.trendLogData = response;
      this.isDone.trendLogData =  true;
      for (let i = 0; i < this.trendLogData.data.length; i++) {
        const item = this.trendLogData.data[i];
        const newValue = item.value / DevicerNumber.electrical
        this.trendLogData.data[i] = {
          ...item, 
          value:  item.value? newValue : null,
          displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.trendLogs)) : null,
          toolText: "Day: $label<br/>Consumption: $displayValue kWh"
        }
      }
      
      this.trendLogData.chart = {
        ...this.trendLogData.chart,
        formatNumberScale: 0,
        valuefontSize: 16,
        paletteColors: [this.colorMap.electric.secondary],
      }
    });
  }


  // setTrendLogData(index: number) {
  //   switch (index) {
  //     case 0: {
  //       this.trendLogTabIndex = 0;
  //       this.htDashboardService.getHTTrendLogs(
  //         Interval.Daily,
  //         this.datePipe.transform(this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
  //         this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
  //         HTApiType.SITE,
  //         this.configs.siteConfigurations.siteId,
  //         ServiceType.MAIN_HT_ELECTRICAL
  //       ).then((response) => {
  //         this.trendLogData = response;
  //         this.trendLogData.chart["paletteColors"] = [this.colorMap.electric.secondary];
  //       });
        
  //       break;
  //     }

  //     case 1: {
  //       this.trendLogTabIndex = 1;
  //       this.trendLogData = this.htDashboardService.getHTTrendLogs(
  //         Interval.Weekly,
  //         this.datePipe.transform(this.thisMonthRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisMonthRange.end, 'yyyy/MM/dd'),
  //         HTApiType.SITE,
  //         this.configs.siteConfigurations.siteId,
  //         ServiceType.MAIN_HT_ELECTRICAL
  //       ).then((response) => {
  //         this.trendLogData = response;
  //         this.trendLogData.chart["paletteColors"] = [this.colorMap.electric.secondary];
  //       });
  //       break;
  //     }

  //     case 2: {
  //       this.trendLogTabIndex = 2;
  //       this.thisYearRange.start.setDate(1);
  //       this.thisYearRange.end.setDate(1);
  //       this.trendLogData = this.htDashboardService.getHTTrendLogs(
  //         Interval.Monthly,
  //         this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisYearRange.end, 'yyyy/MM/dd'),
  //         HTApiType.SITE,
  //         this.configs.siteConfigurations.siteId,
  //         ServiceType.MAIN_HT_ELECTRICAL
  //       ).then((response) => {
  //         this.trendLogData = response;
  //         this.trendLogData.chart["paletteColors"] = [this.colorMap.electric.secondary];
  //       });
  //       break;
  //     }

  //     case 3: {
  //       this.trendLogTabIndex = 3;
  //       this.trendLogData = this.htDashboardService.getHTTrendLogs(
  //         Interval.Yearly,
  //         this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'),
  //         HTApiType.SITE,
  //         this.configs.siteConfigurations.siteId,
  //         ServiceType.MAIN_HT_ELECTRICAL
  //       ).then((response) => {
  //         this.trendLogData = response;
  //         this.trendLogData.chart["paletteColors"] = [this.colorMap.electric.secondary];
  //       });
  //       break;
  //     }
  //   }
  // }

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
    this.getOverviewDashboardData('_todayConsumptionDate')
  }
}
