import ChartGroupType from 'src/enums/ChartGroupType';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DateServiceService} from 'src/app/services/date-service.service';
import {HttpService} from 'src/app/services/http.service';
import {InitialService} from 'src/app/services/initial.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import { HtDashboardService } from 'src/app/services/dashboards/ht-dashboard.service';
import { HeaderService } from 'src/app/services/header.service';
import {DashboardType} from 'src/enums/DashboardType';
import { Interval } from 'src/enums/intervals';
import { HtCategory } from 'src/enums/HtCategory';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import {chartTitle, dateGapGenerator, fixDecimalNumPrecision, moneyFormat} from '../../../util/ChartHelper';
import { HTApiType } from 'src/enums/HTApiType';
import { ChartColorMap, ChartColorMapType, DevicerNumber } from 'src/enums/chart-color-map';
import { DECIMAL_MAP, LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';

@Component({
  selector: 'app-ht-electrical-loop-dashboard',
  templateUrl: './ht-electrical-loop-dashboard.component.html',
  styleUrls: ['./ht-electrical-loop-dashboard.component.scss']
})

export class HtElectricalLoopDashboardComponent implements OnInit {

  tabIndex = 0;
  breakdownSubstationId = 0;
  breakdownMeterId = 0;
  trendLogTabIndex = 0;
  dailyConsumptionData: any = {chart: {}};
  equipmentBreakdownData: any;
  overallConsumptioTotalData: any ;
  overallConsumptioSquareData: any;
  breadCrumbData: any = [];
  equipmentBreakdownDateRange: DateRange;
  trendLogData: any = {};
  equipDistribution: object = {};
  dSource: any;
  today: Date = new Date();
  overallDateRange: DateRange;
  eqDIstDateRange: DateRange;
  weekFirst: any;
  weekLast: any;
  monthFirst: any;
  monthLast: any;
  profileDateRange: DateRange;
  todayDateRange: DateRange;
  thisWeekDateRange: DateRange;
  thisMonthRange: DateRange;
  thisYearRange: DateRange;
  lastFiveYearRange: DateRange;
  substationDistRange: DateRange;
  substationDistribution: object;
  substationDistributionTable = {columns: ['Name', 'Value', 'Percentage'], data: null};
  equipBreakdown: any = [];
  eqBreakDownFilter: DateRange;
  loopId: number;
  siteLoops: any = [];
  siteId : number;
  siteName : string;
  loopName: string;
  seletedLoopId : number;
  colorMap: ChartColorMapType = ChartColorMap;
  isDone: any = {}

  rows = [];
  columns = [
    {name: 'Loop', key: 'loop'},
    {name: 'Substation', key: 'substation'},
    {name: 'Meter', key: 'meter'},
    {name: 'Tag', key: 'tag'}
  ];
  tableLoading = true;

  constructor(
    private dataService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private router: Router,
    private headerService: HeaderService,
    private htDashboardService: HtDashboardService,
    private ltDashboardService: LtDashboardService
  ) {

    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = dateGapGenerator(new Date(), 1, 'day', 'minus' );
    }
    this.substationDistRange = this.dateService.thisMonthUpToNow(this.today);
    this.overallDateRange = this.dateService.thisMonthUpToNow(this.today);
    this.overallDateRange.end = this.today;

    this.profileDateRange = this.dateService.getLastMonth(this.today);

    this.eqDIstDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.equipmentBreakdownDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = dateService.getLastDaysRange(this.today, 7, 'days');

    this.thisMonthRange = dateService.getLastDaysRange(this.today, 30, 'days');

    this.thisYearRange = dateService.getLastDaysRange(this.today, 12, 'months');

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.weekFirst = new Date(this.today).getDate() - new Date(this.today).getDay() + 1;
    this.weekLast = this.weekFirst + 7;

    this.monthFirst = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.monthLast = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);

    this.eqBreakDownFilter = this.dateService.thisMonthUpToNow(this.today);
    this.eqBreakDownFilter.end = this.today;
    this.siteId = this.configs.siteConfigurations.siteId;
    this.route.params.subscribe(params => {
      this.trendLogTabIndex = 0;
      // this.tabIndex = 0;
      this.loopId = params.id;
      this.setLoopName(this.loopId);
      // this.getChartData(0);
      // this.getLoopsList();
      this.appOnInit();
    });

    this.route.data.subscribe(
      data => {
        this.headerService.electricalDashboardType.next(DashboardType.HIGH_TENSION);
      }
    );
  }

  // ngOnInit() {
  // }

  ngOnInit() {
    
  }

  appOnInit = () => {
    const { tabkey = 0 }: any = this.route.snapshot.queryParams || {};
    this.tabIndex = tabkey;
    this.getLoopsList((isDone) => {
      if(tabkey && tabkey!= 0){
        this.setTabIndex(tabkey);
      }else{
        this.getChartData(0);
      }
    })
  }

  private setLoopName(loopId) {
    this.dataService.get(this.configs.endPoints['ht-loops'], {
      siteId: this.siteId,
    })
    .subscribe(data => {
      this.headerService.setItem(this.selectLoopName(data));
    },
    error => {
      this.headerService.setItem('Loop Name');
    });
  }

  private selectLoopName(data){
    for(const loop of data) {
      if (loop.htLoopID == this.loopId) {
        this.loopName = loop.htLoopName;
        return loop.htLoopName;
      }
    }
  }

  private getChartData(tabIndex) {
    this.substationDistributionChanged(tabIndex);
    this.getTrendDaylyData();
    this.getOverallConsumption();
    this.onChangeTrendLogByDate()
  }

  private getLoopsList(callback: (isDone: boolean) => void)
  {
    this.dataService.get(this.configs.endPoints['ht-loops'], {
      siteId: this.siteId,
    }).subscribe(res => {

      this.siteLoops = [];
      res.forEach(item => {
        this.siteLoops.push({name : item.htLoopName, id: item.htLoopID});
      });
      callback(true)
    });
    this.seletedLoopId = this.loopId;
  }

  loopChanged(data) {

    this.rows = [];
    this.equipmentBreakdownData = null;

    // if ( data.value == '0' ) {
    //   this.router.navigateByUrl(encodeURI(`ht-site-electrical`));
    // } else {
    //   this.router.navigateByUrl(encodeURI(`ht-electrical-loop/${data.value}`));
    // }

    if (data.value === "0") {
      this.router.navigateByUrl(
        encodeURI(`ht-site-electrical?tabkey=${this.tabIndex}`)
      );
    } else {
      this.router.navigateByUrl(encodeURI(`ht-electrical-loop/${data.value}?tabkey=${this.tabIndex}`));
    }

    this.setLoopName(data.value);
  }

  onEquipmentBreakdownFiltered(data) {
    this.rows = [];
    data.forEach(item => {
      this.rows.push({
        loop: item.loopName, substation: item.substationName, meter: item.meterName, tag: item.opcTag
      });
    });
  }

  onEqBreakdownDateChange(event) {
    this.eqBreakDownFilter = event;
    this.getLoopBreakdownData();
  }

  addingColorToData = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        ...arr[i],
        color: this.colorMap.electric.secondary,
      }
    }
    return arr;
  }

  plotTrendDaylyData(data) {
    const chart = {...this.configs.chartConfigurations['elec-trend-log']};
   // chart.xAxisName = 'Time';
    chart.yAxisName = 'Energy Consumption (kWh)';
    chart.exportFileName = 'Today\'s Consumption';
    
    this.dailyConsumptionData = {
      chart,
      data: this.addingColorToData(data[0].data)
    };
  }

  generateTrendDaylyData() {
    let time0 = new Date().setHours(0, 0, 0, 0);
    const labelAndValue = [];
    for (let i = 0; i < 48; i++) {
      labelAndValue.push({label: this.datePipe.transform(time0, 'HH:mm'), value: null});
      time0 = new Date(time0).setTime(new Date(time0).getTime() + 30  * 60 * 1000);
    }
    const data = [
      {
        name: '',
        data: labelAndValue
      }
    ];
    return data;
  }

  getTrendDaylyData(dateKey: string = '_todayConsumptionDate') {
    this.isDone.dailyConsumptionData = false;
    this.dailyConsumptionData = this.ltDashboardService.getTodaysConsumptionEmptyChart(ChartDashboardType.SITE_ELECTRICAL);
    this.htDashboardService.getHTTrendDaylyData(
      this.datePipe.transform(this[dateKey].start, 'yyyy/MM/dd'),
      this.datePipe.transform(this[dateKey].end, 'yyyy/MM/dd'),
      HTApiType.LOOP,
      this.loopId
    ).then(result=>{
      this.dailyConsumptionData = result;
      for (let i = 0; i < this.dailyConsumptionData.data.length; i++) {
        const item = this.dailyConsumptionData.data[i];
        const newValue = item.value / DevicerNumber.electrical
        this.dailyConsumptionData.data[i] = {
          ...item,
          value: item.value? newValue: null, 
          displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.electricalTodayConsumption)) : null,
          toolText: "Time: $label <br/> Consumption: $displayValue kWh",
        }
      }
      this.dailyConsumptionData.chart = {
        ...this.dailyConsumptionData.chart,
        formatNumberScale: 0,
        paletteColors: [this.colorMap.electric.secondary],
      }
      this.isDone.dailyConsumptionData = true;
    });
  }

  plotTrendLogs(xAxis, yAxis, toolTipLableName, data, mode) {
    let dataSet = [];

    if (mode) {
      data[0].data.forEach(element => {
        dataSet.push(
          {
            label: element.label.substring(0, 3),
            value: element.value,
            tooltext: `${toolTipLableName}: ${element.label}<br/>Consumption: ${element.value} kWh`,
            color: this.colorMap.electric.secondary
          }
        );
      });
    } else {
      dataSet = data[0].data;
    }

    const chart = { ...this.configs.chartConfigurations['elec-trend-log'] };
    chart.xAxisName = xAxis;
    chart.yAxisName = yAxis;
    chart.paletteColors = [this.colorMap.electric.secondary];
    this.trendLogData = {
      chart,
      data: dataSet
    };
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    
    if (this.tabIndex == 0) {
      this.getChartData(index);
    }else if (this.tabIndex == 1) {
      this.substationDistributionChanged(1);
    }else if (this.tabIndex == 2) {
      this.getLoopBreakdownData();
    }
    window.history.pushState(null, null, index!=0 ? `${window.location.pathname}?tabkey=${index}`  : `${window.location.pathname}`);
  }

  getLoopBreakdownData() {
    this.htDashboardService.getLoopBreakdownData(
      this.loopId,
      this.loopName,
      this.datePipe.transform(this.eqBreakDownFilter.start, 'yyyy/MM/dd'),
      this.datePipe.transform(this.eqBreakDownFilter.end, 'yyyy/MM/dd')
    ).then(res => {
      this.equipBreakdown =  res;
      this.tableLoading = false;
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
    this.callApiTrendLogData(this.trendLogTabIndex+1, this.getDate(newStart), this.getDate(newEnd))
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
      HTApiType.LOOP,
      this.loopId
    ).then((response) => {
      this.trendLogData = response;
      this.isDone.trendLogData =  true;
      // for (let i = 0; i < this.trendLogData.data.length; i++) {
      //   const item = this.trendLogData.data[i];
      //   const newValue = item.value / DevicerNumber.electrical;
      //   this.trendLogData.data[i] = {
      //     ...item, 
      //     value: item.value ? newValue : null,
      //     displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.trendLogs)) : null,
      //     toolText: "Day: $label <br/> Consumption: $displayValue kWh"
      //   }
      // }
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
  //         this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
  //         HTApiType.LOOP,
  //         this.loopId
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
  //         HTApiType.LOOP,
  //         this.loopId
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
  //         HTApiType.LOOP,
  //         this.loopId
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
  //         HTApiType.LOOP,
  //         this.loopId
  //       ).then((response) => {
  //         this.trendLogData = response;
  //         this.trendLogData.chart["paletteColors"] = [this.colorMap.electric.secondary];
  //       });
  //       break;
  //     }
  //   }
  // }

  getOverallConsumption() {
    this.isDone.overallConsumptioTotalData = false;
    this.htDashboardService.getHTOveralConsumptionData(
      this.overallDateRange.start.toDateString(),
      this.overallDateRange.end.toDateString(),
      HTApiType.LOOP,
      this.loopId
    ).then((response) => {
      this.overallConsumptioTotalData = fixDecimalNumPrecision(response[0].data[0].value, 2);
      this.isDone.overallConsumptioTotalData = true;
    });
  }

  dateRangeListner(chartType, tabIndex) {
    this.resetTime();
    let dataset;
    switch (chartType) {
      case 'eqDist':
        dataset = this.substationDistributionChanged(tabIndex);
        if (dataset !== null) {

        } else {

        }
        break;
      case 'overall':
        dataset = this.getOverallConsumption();
        break;
    }
  }

  substationDistributionChanged(tabIndex) {
    this.isDone.substationDistribution = false;
    this.resetTime();
    this.htDashboardService.getSubstationDistribution(
      this.datePipe.transform(this.substationDistRange.start, 'yyyy/MM/dd'),
      this.datePipe.transform(this.substationDistRange.end, 'yyyy/MM/dd'),
      this.loopId,
      HTApiType.LOOP,
      HtCategory.SubStation,
      tabIndex,
      ChartGroupType.SUB_STATIONS
    ).then((response) => {
      this.substationDistribution = response;
      this.isDone.substationDistribution = true;
    });
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
