import ChartGroupType from 'src/enums/ChartGroupType';
import { LtDashboardService } from './../../services/dashboards/lt-dashboard.service';
import { Component, OnInit } from '@angular/core';
import {DateRange} from '../../widgets/date-range-picker/lib/models/date-range';
import {HeaderService} from '../../services/header.service';
import {HttpService} from '../../services/http.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DateServiceService} from '../../services/date-service.service';
import {InitialService} from '../../services/initial.service';
import {MeterService} from '../../services/meter.service';
import {ServiceType} from '../../../enums/ServiceType';
import { EquipmentBreakdownService } from 'src/app/services/equipment-breakdown.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {saveSvgAsPng} from 'save-svg-as-png';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import { DistributionChartType } from 'src/enums/DustributionChartType';
import { abbreviateNumber, dateGapGenerator, fixDecimalNumPrecision } from 'src/util/ChartHelper';
import { ChartColorMap, ChartColorMapType } from 'src/enums/chart-color-map';
import { LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';

@Component({
  selector: 'app-water-group-dashboard',
  templateUrl: './water-group-dashboard.component.html',
  styleUrls: ['./water-group-dashboard.component.scss']
})
export class WaterGroupDashboardComponent implements OnInit {
  tabIndex = 0;
  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;
  dailyConsumptionData: any = {chart: {}};
  overallConsumptioTotalData: any  = 0;
  overallConsumptioSquareData: any = 0;
  trendLogData: any = {};
  equipDistribution: object = {};
  equipDistributionLg: object = {};
  meterTreeData: any ;
  today: Date;
  overallDateRange: DateRange;
  eqDIstDateRange: DateRange;
  groupId: number;
  weekFirst: any;
  weekLast: any;
  monthFirst: any;
  monthLast: any;
  profileDateRange: DateRange;
  buildingName: string;
  eqdistlg: DateRange;
  squareMeterPointerDescription: string = 'EUI<br> (GFA = N/A m<sup>2</sup>)';
  todayDateRange: DateRange;
  thisWeekDateRange: DateRange;
  thisMonthRange: DateRange;
  thisYearRange: DateRange;
  lastFiveYearRange: DateRange;
  meterTreeDateRange: DateRange;
  equipmentBreakdownDateRange: DateRange;
  eqBreakdownFiltered: any;
  buildings: any = [];
  FileDownloadIcon = faDownload;
  meterTreeLoading: boolean;
  colorMap: ChartColorMapType = ChartColorMap;
  rows = [];
  columns = [
    {name: 'No.', key: 'meterId'},
    {name: 'Group Name', key: 'groupName'},
    {name: 'Block', key: 'block'},
    {name: 'Level', key: 'level'},
    {name: 'Equipment Type', key: 'eqType'},
    {name: 'Equipment Code', key: 'eqCode'},
    {name: 'Consumption ( m<sup>3</sup> )', key: 'value'}
  ];
  tableLoading = true;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private meterService: MeterService,
    private router: Router,
    private ltServiceDashboard: LtDashboardService
  ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = dateGapGenerator(new Date(), 1, 'day', 'minus' );
    }

    this.overallDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.meterTreeDateRange = this.dateService.getTodayUpToNow(this.today);

    this.profileDateRange = this.dateService.getThisMonth(this.today);

    this.eqDIstDateRange = this.dateService.getThisMonth(this.today);

    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = this.dateService.getLastDaysRange(this.today, 7, 'days');
    this.thisMonthRange = this.dateService.getLastDaysRange(this.today, 30, 'days');
    this.thisYearRange = this.dateService.getLastDaysRange(this.today, 12, 'months');

    this.equipmentBreakdownDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.eqdistlg = this.dateService.thisMonthUpToNow(this.today);

    this.eqDIstDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.weekFirst = new Date(this.today).getDate() - new Date(this.today).getDay() + 1;
    this.weekLast = this.weekFirst + 7;

    this.monthFirst = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.monthLast = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);

    this.route.params.subscribe(params => {
      this.trendLogTabIndex = 0;
      // this.tabIndex = 0;
      this.groupId = parseInt(params.id);
      this.equipDistributionLg = null;
      // this.fillDashboard();
      this.appOnInit();
    });
  }

  ngOnInit() {
    
  }

  appOnInit = () => {
    const { tabkey = 0 }: any = this.route.snapshot.queryParams || {};
    
    this.tabIndex = tabkey;
    this.fillDashboard((isDone) => {
      if(tabkey && tabkey!= 0){
        this.setTabIndex(tabkey);
      }else{
        this.getChartDatas();
        this.getOverallConsumption();
      }
    });
  }

  private fillDashboard(callback: (isDone: boolean) => void) {

    this.initialService.navigationStore.buildingGroups$.subscribe(res=>{
      if(res.length !== 0 && res !== null) {
        let buildingGroup = this.initialService.navigationStore.getBuildingGroupById(this.groupId);
        if(buildingGroup.length !== 0 && !null) {
          this.buildingName = buildingGroup[0].description;
          this.headerService.setItem(buildingGroup[0].description);
          this.headerService.serviceType.next(ServiceType.WATER);
        }
      }
    });

    this.initialService.navigationStore.buildings$.subscribe(res=>{
      if(res.length !== 0 && res !== null) {
        let buildingList = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.groupId);
        this.buildings = [];
        buildingList = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == ServiceType.WATER));
        buildingList.forEach(element => {
          this.buildings.push({name: element.buildingName, id: element.buildingID});
        });
        callback(true)
      }
    });
  }

  onEqBreakdownFilter(e) {
    this.equipmentBreakdownDateRange = e;
    this.getEqBreakdownData(this.equipmentBreakdownDateRange);
  }

  exportMeter(){
    // saveSvgAsPng(document.getElementById("meterTreeSvg"), "Meter Tree.jpeg");
    const svg: any = document.getElementById("meterTreeSvg");
    // const svg: any = parent.querySelector('svg'); 
    const g = svg.querySelector('g') 
    g.setAttribute('transform', 'scale(.7)') 
    saveSvgAsPng(svg, "Meter Tree-"+ new Date().getTime()+'.jpeg', {width: 1440});
  }

  private getChartDatas() {
    this.initialService.navigationStore.meterTypes$.subscribe(res=>{
      if(res !== null && res.length !== 0) {
        this.getEqDistribution();
      }
    });
    this.getTrendDaylyData();
    this.onChangeTrendLogByDate();
  }

  private getEqBreakdownData(dateRange) {
    this.tableLoading = true;
    this.ltServiceDashboard.getBuildingGroupEqBreakDown(this.groupId , ServiceType.WATER, dateRange).then(res => {
      this.eqBreakdownFiltered = res;
      this.tableLoading = false;
    });
  }

  private getMeterTreeData() {
    this.meterTreeLoading = true;
    this.meterService.getGroupMeterTree(this.groupId, ServiceType.WATER).then(res => {
      this.meterTreeData = res;
      this.meterTreeLoading = false;
    }).catch( err => {
      this.meterTreeData = {};
      this.meterTreeLoading = false;
    });
  }

  get serviceType() { return ServiceType; }

  dataSourceOut(data) {
    if (data !== undefined) {
      this.rows = [];
      data.forEach((row, i) => {
        const { scalledNumber, suffix, unit } = abbreviateNumber(row.meter.value, ServiceType.WATER);
        this.rows.push({
          meterId: i + 1,
          groupName: row.group.name,
          block: row.block.name,
          level: row.level.name,
          eqType: row.eqType.name,
          eqCode: row.eqCode.name,
          value: scalledNumber+suffix
          // value: fixDecimalNumPrecision(row.meter.value, this.configs.siteConfigurations.decimalNumPrecision)
        });
      });
    }
  }

  getTrendDaylyData(dateKey: string = '_todayConsumptionDate') {
    this.isDone.dailyConsumptionData = false;
    this.dailyConsumptionData = this.ltServiceDashboard.getTodaysConsumptionEmptyChart(ChartDashboardType.BUILDING_WATER);
    this.ltServiceDashboard.getBuildingGroupTodaysConsumption(
        ServiceType.WATER,
        this[dateKey].start,
        this[dateKey].end,
        this.groupId,ChartDashboardType.BUILDING_WATER
    ).then(res=>{
      this.dailyConsumptionData = res;
      this.dailyConsumptionData.chart["paletteColors"] = [this.colorMap.water.secondary];
      this.isDone.dailyConsumptionData = true;
    });
  }

  getTrendLogs(interval, from, to) {
    // TODO: load empty chart chart
    // this.trendLogData = this.ltServiceDashboard.getEmptyConsumptionChart(ServiceType.WATER, interval);
    this.isDone.trendLogData = false;
    this.ltServiceDashboard.getBuildingGroupConsumptionChart(ServiceType.WATER, from, to, this.groupId, interval).then(res=>{
      this.trendLogData = res;
      this.trendLogData.chart["paletteColors"] = [this.colorMap.water.secondary];
      this.isDone.trendLogData = true;
    });
  }

  getEqDistribution(){
    this.ltServiceDashboard.getBuildingGroupEquipmentDistribution(
      ServiceType.WATER,
      this.eqDIstDateRange.start,
      this.eqDIstDateRange.end,
      this.groupId,
      ChartDashboardType.BUILDING_WATER,
      DistributionChartType.SMALL,
      ChartGroupType.METER_TYPES
    ).then(res=>{
      this.equipDistribution = res;
    });
  }

  getEqDistributionLg() {
    this.isDone.equipDistributionLg = false;
    this.ltServiceDashboard.getBuildingGroupEquipmentDistribution(
      ServiceType.WATER,
      this.eqdistlg.start,
      this.eqdistlg.end,
      this.groupId,
      ChartDashboardType.BUILDING_WATER,
      DistributionChartType.LARGE,
      ChartGroupType.METER_TYPES
    ).then(res=>{
      this.equipDistributionLg = res;
      this.isDone.equipDistributionLg = true;
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    this.meterTreeData = null;
    
    if(this.tabIndex == 0) {
      this.getChartDatas();
    }else if(this.tabIndex == 1) {
      this.equipDistributionLg = {};
      this.getEqDistributionLg();
    }else if(this.tabIndex == 2) {
      this.getEqBreakdownData(this.equipmentBreakdownDateRange);
    }else if(this.tabIndex ==3){
      this.meterTreeData = null;
      this.getMeterTreeData ();
    }
    window.history.pushState(null, null, index!=0 ? `${window.location.pathname}?tabkey=${index}`  : `${window.location.pathname}`);
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

  getOverallConsumption() {
    this.isDone.overallConsumptioTotalData = false;
    this.ltServiceDashboard.getOverallConsumptionBuildingGroup(ServiceType.WATER,this.overallDateRange.start,this.overallDateRange.end, this.groupId).then(res=>{
      this.overallConsumptioTotalData = fixDecimalNumPrecision(res, 2);
      this.getGfa();
      this.isDone.overallConsumptioTotalData = true;
    });
  }

  isDone: any = {}
  getGfa() {
    this.isDone.overallConsumptioSquareData = false;
    this.ltServiceDashboard.getGFABuildingGroup(ServiceType.WATER, this.groupId).then(res => {
      if (res != null && res != 0 ) {
        this.overallConsumptioSquareData = (this.overallConsumptioTotalData == null || this.overallConsumptioTotalData == 0)?null:fixDecimalNumPrecision(this.overallConsumptioTotalData / (res), 2);
        this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = '+res+' m<sup>2</sup>)';
      } else {
        this.overallConsumptioSquareData = null;
        this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = N/A m<sup>2</sup>)';
      }
      this.isDone.overallConsumptioSquareData = true;
    });
  }

  buildingChanged(data){
    if ( data.value === 0 ) {
        this.router.navigateByUrl(encodeURI(`water-building-group/${this.groupId}?tabkey=${this.tabIndex}`));
    }
    this.router.navigateByUrl(encodeURI(`water/${data.value}?tabkey=${this.tabIndex}`));
  }

  dateRangeListner(chartType) {
    this.resetTime();
    let dataset;
    switch (chartType) {
      case 'eqDist':
        dataset = this.getEqDistribution();
        break;
      case 'overall':
        dataset = this.getOverallConsumption();
        break;
      case 'eqdistlg':
        this.getEqDistributionLg();
        break;

    }
  }

  _reload: boolean = true;
  resetTime(){
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
  }
}
