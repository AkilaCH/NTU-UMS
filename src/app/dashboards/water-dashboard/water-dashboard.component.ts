import ChartGroupType from 'src/enums/ChartGroupType';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import {Component, OnInit} from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {Table} from 'src/app/models/table';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {DateServiceService} from 'src/app/services/date-service.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {InitialService} from 'src/app/services/initial.service';
import {Interval} from '../../../enums/intervals';
import {ServiceType} from '../../../enums/ServiceType';
import {MeterService} from '../../services/meter.service';
import { EquipmentBreakdownService } from 'src/app/services/equipment-breakdown.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {saveSvgAsPng} from 'save-svg-as-png';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import { DistributionChartType } from 'src/enums/DustributionChartType';
import { abbreviateNumber, dateGapGenerator, fixDecimalNumPrecision } from 'src/util/ChartHelper';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { ChartColorMap, ChartColorMapType } from 'src/enums/chart-color-map';
import { LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';
@Component({
  selector: 'app-water-dashboard',
  templateUrl: './water-dashboard.component.html',
  styleUrls: ['./water-dashboard.component.scss']
})
export class WaterDashboardComponent implements OnInit {

  tabIndex = 0;

  trendLogTabIndex = 0;

  dailyConsumptionData: any = {chart: {}};

  trendLogData: any = {};

  equipDistribution: object = {};

  meterTreeData: any;

  equipBreakdown: Table;

  equipDistributionLg: any = {};

  eqdistlg: DateRange;

  equipmentBreakdownDateRange: DateRange;

  today: Date;

  equipmentBreakdownData: any = null;

  dateRange: DateRange;

  overollConsumptionRange: DateRange;

  overollConsumptionData: any;

  overallConsumptioSquareData: any;

  eqDIstDateRange: DateRange;

  buildingId: number;

  serviceTypeId: number = 2;

  weekFirst: any;
  weekLast: any;

  monthFirst: any;
  monthLast: any;

  buildingName: string;
  buildingGroupName: string;

  todayDateRange: DateRange;

  thisWeekDateRange: DateRange;

  thisMonthRange: DateRange;

  thisYearRange: DateRange;

  lastFiveYearRange: DateRange;

  squareMeterPointerDescription: string = 'EUI<br> (GFA = N/A m2)';

  meterTreeDatas: any;

  meterTreeDateRange: DateRange;

  FileDownloadIcon = faDownload;

  buildingList: any = [];

  selectedBuilding: number;

  buildingGroupId: number;
  meterTreeLoading: boolean;
  colorMap: ChartColorMapType = ChartColorMap;

  rows = [];
  columns = [
    {name: 'No.', key: 'meterId'},
    {name: 'Level', key: 'level'},
    {name: 'Equipment Type', key: 'eqType'},
    {name: 'Equipment Code', key: 'eqCode'},
    {name: 'Consumption ( m<sup>3</sup> )', key: 'value'}
  ];
  tableLoading = true;


  constructor(
    private headerService: HeaderService,
    private thousandSeparator: ThousandSeparatorPipe,
    private configs: InitialService,
    private dateService: DateServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private initialService: InitialService,
    private meterService: MeterService,
    private equipmentBreakdownService: EquipmentBreakdownService,
    private router: Router,
    private ltDashboardService: LtDashboardService
  ) {

    if(this.initialService.getDemoConfig().isDemo){
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = dateGapGenerator(new Date(), 1, 'day', 'minus' );
    }

    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = this.dateService.getLastDaysRange(this.today, 7, 'days');
    this.thisMonthRange = this.dateService.getLastDaysRange(this.today, 30, 'days');
    this.thisYearRange = this.dateService.getLastDaysRange(this.today, 12, 'months');

    this.meterTreeDateRange = this.dateService.getTodayUpToNow(this.today);

    this.equipmentBreakdownDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.eqDIstDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.eqdistlg = this.dateService.thisMonthUpToNow(this.today);

    this.weekFirst = new Date(this.today).getDate() - new Date(this.today).getDay()+1;
    this.weekLast = this.weekFirst + 7;

    this.monthFirst = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.monthLast = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);

    this.overollConsumptionRange = this.dateService.thisMonthUpToNow(this.today);

    this.route.params.subscribe(params => {
      this.trendLogTabIndex = 0;
      // this.tabIndex = 0;
      this.buildingId = parseInt(params.id);
      
      // this.getChartDetails();
      this.headerService.setBoardLevel(1);
      this.appOnInit();
    });
  }

  ngOnInit() {
  }

  appOnInit = () => {
    const { tabkey = 0 }: any = this.route.snapshot.queryParams || {};
    this.tabIndex = tabkey;
    this.getBuildingName((isDone) => {
      if(tabkey && tabkey!= 0){
        this.setTabIndex(tabkey);
      }else{
        this.getChartDetails();
      }
    });
  }


  private getBuildingName(callback: (isDone: boolean) => void){
    this.initialService.navigationStore.buildings$.subscribe(res=>{
      if(res.length !== 0 && res !== null) {
        let building = this.initialService.navigationStore.getBuilding(this.buildingId);
        if(building.length !== 0 && !null) {
          this.headerService.setItem(building[0].buildingName);
          this.headerService.serviceType.next(ServiceType.WATER);
          this.buildingGroupId = building[0].buildingGroupID;
          this.buildingGroupName = this.initialService.navigationStore.getBuildingGroupById(this.buildingGroupId)[0].description;
          let buildingList = this.initialService.navigationStore.getBuildingsByBuildingGroup(building[0].buildingGroupID);
          this.buildingList = [];
          buildingList = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == ServiceType.WATER));
          buildingList.forEach(element => {
            this.buildingList.push({name: element.buildingName, id: element.buildingID});
          });
          this.selectedBuilding = this.buildingId;
          callback(true)
        }
      }

    });
  }

  exportMeter(){
    // saveSvgAsPng(document.getElementById("meterTreeSvg"), "Meter Tree.jpeg");
    const svg: any = document.getElementById("meterTreeSvg");
    // const svg: any = parent.querySelector('svg'); 
    const g = svg.querySelector('g') 
    g.setAttribute('transform', 'scale(.7)') 
    saveSvgAsPng(svg, "Meter Tree-"+ new Date().getTime()+'.jpeg', {width: 1440});
  }

  onEqBreakdownFilter(e) {
    this.equipmentBreakdownDateRange = e;
    this.getEqBreakdownData(this.equipmentBreakdownDateRange);
  }

  private getChartDetails(){
    this.getOverallConsumption();
    this.getTrendDaylyData();
    this.onChangeTrendLogByDate();
    this.initialService.navigationStore.meterTypes$.subscribe(res=>{
      if(res !== null && res.length !== 0) {
        this.getEqDistribution();
      }
    });
  }


  private getEqBreakdownData(daterange: DateRange) {
    this.equipmentBreakdownService.requestBuildingData(
      this.buildingId,
      null,
      null,
      null,
      ServiceType.WATER,
      this.equipmentBreakdownDateRange.start,
      this.equipmentBreakdownDateRange.end
    ).then(data => {
      this.equipmentBreakdownData = data;
      this.tableLoading = false;
    });
  }

  private getMeterTreeData() {
    this.meterTreeLoading = true;
    this.meterService.getBuildingMeterTree(this.buildingId, ServiceType.WATER).then(res => {
      this.meterTreeDatas = res;
      this.meterTreeLoading = false;
    });
  }

  onBreakdownFiltered(event){
    if (event !== null) {
      this.rows = [];
      event.forEach((row, i) => {
        const { scalledNumber, suffix, unit } = abbreviateNumber(row.meter.value, ServiceType.WATER);
        this.rows.push({
          meterId: i + 1,
          level: row.level.name,
          eqType: row.eqType.name,
          eqCode: row.eqCode.name,
          value: scalledNumber+suffix
          // value: this.thousandSeparator.transform(fixDecimalNumPrecision(row.meter.value, this.configs.siteConfigurations.decimalNumPrecision))
        });
      });
    }
  }

  // private getOverallConsumption() {
  //   this.ltDashboardService.getOverallConsumptionBuilding(ServiceType.WATER, this.overollConsumptionRange.start, this.overollConsumptionRange.end, this.buildingId).then(res=>{
  //     this.overollConsumptionData = fixDecimalNumPrecision(res, 2);
  //     this.getGfa();
  //   });
  // }

  get serviceType() { return ServiceType; }

  // getGfa() {
  //   this.ltDashboardService.getGFABuilding(ServiceType.WATER, this.buildingId).then(res=>{
  //     if (res == null || res == 0 ) {
  //       this.overallConsumptioSquareData = null;
  //       this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = N/A m<sup>2</sup>)';
  //     } else {
  //       this.overallConsumptioSquareData = (this.overallConsumptioSquareData == null || this.overallConsumptioSquareData == 0)?null:this.overallConsumptioSquareData / (res);
  //       this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = '+res+' m<sup>2</sup>)';
  //     }
  //   });
  // }
  isDone: any = {};
  getOverallConsumption() {
    this.isDone.overollConsumptionData = false;
    this.ltDashboardService.getOverallConsumptionBuilding(ServiceType.WATER, this.overollConsumptionRange.start, this.overollConsumptionRange.end, this.buildingId).then(res=>{
      this.overollConsumptionData = fixDecimalNumPrecision(res, 2);
      this.getGfa();
      this.isDone.overollConsumptionData = true;
    })
  }

  getGfa() {
    this.isDone.overallConsumptioSquareData = false;
    this.ltDashboardService.getGFABuilding(ServiceType.WATER, this.buildingId).then(res=>{
      this.isDone.overallConsumptioSquareData = true;
      if (res == null || res == 0 ) {
        this.overallConsumptioSquareData = null;
        this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = N/A m<sup>2</sup>)';
      } else {
        this.overallConsumptioSquareData = fixDecimalNumPrecision(
          (this.overollConsumptionData == null || this.overollConsumptionData == 0)?null:this.overollConsumptionData / (res),
          this.configs.siteConfigurations.decimalNumPrecision
        );
        this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = ' + res + ' m<sup>2</sup>)';
      }
    });
  }


  getEqDistribution(){
    this.ltDashboardService.getBuildingEquipmentDistribution(
      ServiceType.WATER,
      this.eqDIstDateRange.start,
      this.eqDIstDateRange.end,
      this.buildingId,
      ChartDashboardType.BUILDING_WATER,
      DistributionChartType.SMALL,
      ChartGroupType.METER_TYPES
    ).then(res=>{
      this.equipDistribution = res;
    });
  }

  getEqDistributionLg() {
    this.resetTime();
    this.ltDashboardService.getBuildingEquipmentDistribution(
      ServiceType.WATER,
      this.eqDIstDateRange.start,
      this.eqDIstDateRange.end,
      this.buildingId,
      ChartDashboardType.BUILDING_WATER,
      DistributionChartType.LARGE,
      ChartGroupType.METER_TYPES
    ).then(res=>{
      this.equipDistributionLg = res;
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    this.meterTreeDatas = null;
    if(this.tabIndex == 0) {
      this.getChartDetails();
    }else if(this.tabIndex == 1) {
      this.getEqBreakdownData(this.equipmentBreakdownDateRange);
    }else if(this.tabIndex == 2){
      this.meterTreeDatas = null;
      this.getMeterTreeData();
    }else if(this.tabIndex == 3) {
      this.getEqDistributionLg();
    }
    window.history.replaceState(null, null, index!=0 ? `${window.location.pathname}?tabkey=${index}`  : `${window.location.pathname}`);
  }

  getTrendDaylyData(dateKey: string = '_todayConsumptionDate') {
    this.isDone.dailyConsumptionData = false;
    this.dailyConsumptionData = this.ltDashboardService.getTodaysConsumptionEmptyChart(ChartDashboardType.BUILDING_WATER);
    this.ltDashboardService.getBuildingTodaysConsumption(
        ServiceType.WATER,
        this[dateKey].start,
        this[dateKey].end,
        this.buildingId,
        ChartDashboardType.BUILDING_WATER
    ).then(res=>{
      this.dailyConsumptionData = res;
      this.dailyConsumptionData.chart["paletteColors"] = [this.colorMap.water.secondary];
      this.isDone.dailyConsumptionData = true;
    });
  }

  getTrendLogs(interval, from, to) {
    // TODO: load empty chart chart
    // this.trendLogData = this.ltDashboardService.getEmptyConsumptionChart(ServiceType.WATER, interval);
    this.isDone.trendLogData =  false;
    this.ltDashboardService.getBuildingConsumptionChart(ServiceType.WATER, from, to, this.buildingId,interval).then(res=>{
      this.trendLogData = res;
      this.trendLogData.chart["paletteColors"] = [this.colorMap.water.secondary];
      this.isDone.trendLogData =  true;
    });
  }

  buildingChanged(data) {
    this.rows = null;
    this.equipmentBreakdownData = null;
    if ( data.value == '0' ) {
      this.router.navigateByUrl(encodeURI(`water-building-group/${this.buildingGroupId}?tabkey=${this.tabIndex}`));
    } else {
      this.router.navigateByUrl(encodeURI(`water/${data.value}?tabkey=${this.tabIndex}`));
    }
  }

  overallConsumptionChanged () {
    this.resetTime();
    this.getOverallConsumption();
  }

  eqDateRangeChange(type="small"){
    this.resetTime();
    switch(type){
      case 'small':
        this.getEqDistribution();
        break;
      case 'large':
        this.getEqDistributionLg();
        break;
    }
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
    this.resetTime()
  }

  setTrendLogData(index: number) {
    this.trendLogTabIndex = index;
    this.onChangeTrendLogByDate()
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


  // setTrendLogData(index: number) {
  //   switch(index) {
  //     case 0: {
  //       this.trendLogTabIndex = 0;
  //       this.getTrendLogs(
  //         Interval.Daily,
  //         this.datePipe.transform(
  //           this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
  //         this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'));
  //       break;
  //     };

  //     case 1: {
  //       this.trendLogTabIndex = 1;
  //       this.getTrendLogs(2,
  //         this.datePipe.transform(this.thisMonthRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisMonthRange.end, 'yyyy/MM/dd'));
  //       break;
  //     };

  //     case 2: {
  //       this.trendLogTabIndex = 2;
  //       this.thisYearRange.start.setDate(1);
  //       this.thisYearRange.end.setDate(1);
  //       this.getTrendLogs(3,
  //         this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.thisYearRange.end, 'yyyy/MM/dd'));
  //       break;
  //     };

  //     case 3: {
  //       this.trendLogTabIndex = 3;
  //       this.getTrendLogs(4,
  //         this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
  //         this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'));
  //       break;
  //     }
  //   }
  // }

  _reload: boolean = true;
  resetTime(){
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
  }
}
