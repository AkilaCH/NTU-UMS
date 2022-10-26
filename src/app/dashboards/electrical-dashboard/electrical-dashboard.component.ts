import ChartGroupType from "src/enums/ChartGroupType";
import { LtDashboardService } from "./../../services/dashboards/lt-dashboard.service";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Table } from "src/app/models/table";
import { DateServiceService } from "src/app/services/date-service.service";
import { HeaderService } from "src/app/services/header.service";
import { InitialService } from "src/app/services/initial.service";
import { DateRange } from "src/app/widgets/date-range-picker/public-api";
import { ServiceType } from "../../../enums/ServiceType";
import { MeterService } from "../../services/meter.service";
import { EquipmentBreakdownService } from "src/app/services/equipment-breakdown.service";
import { DashboardType } from "src/enums/DashboardType";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { saveSvgAsPng } from "save-svg-as-png";
import { abbreviateNumber, chartTitle, dateGapGenerator, fixDecimalNumPrecision, moneyFormat } from "../../../util/ChartHelper";
import ChartDashboardType from "src/enums/ChartDashboardType";
import { DistributionChartType } from "src/enums/DustributionChartType";
import { ThousandSeparatorPipe } from "src/app/pipes/thousand-separator.pipe";
import { ConsumptionSummeryChartComponent } from "src/app/widgets/consumption-summery-chart/consumption-summery-chart.component";
import { find, orderBy } from "lodash-es";
import { DateTypes } from 'src/enums/DateTypes';
import { ChartColorMap, ChartColorMapType, DevicerNumber } from "src/enums/chart-color-map";
import { DECIMAL_MAP, LIST_DAY_CONSUMPTION } from 'src/enums/chart-config-map';

@Component({
  selector: "app-electrical-dashboard",
  templateUrl: "./electrical-dashboard.component.html",
  styleUrls: ["./electrical-dashboard.component.scss"],
})
export class ElectricalDashboardComponent implements OnInit {
  [x: string]: any;
  @ViewChild(ConsumptionSummeryChartComponent, { static: false })
  typeChart: ConsumptionSummeryChartComponent;
  // 0 = overview, 1 = equipment distribution, 2 = equipment breakdown, 3 = meter tree, 4 = reports
  tabIndex = 0;
  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;
  dailyConsumptionData: any = {chart: {}};
  equipmentBreakdownData: any = null;
  overallConsumptioTotalData: any;
  overallConsumptioSquareData: any;
  breadCrumbData: any = [];
  equipmentBreakdownDateRange: DateRange;
  trendLogData: any = {};
  equipDistribution: object = {};
  equipDistributionLg: object = {};
  meterTreeData: any;
  dSource: any;
  today: Date;
  overallDateRange: DateRange;
  eqDIstDateRange: DateRange;
  buildingId: number;
  weekFirst: any;
  weekLast: any;
  monthFirst: any;
  monthLast: any;
  yearFirst: any;
  yearLast: any;
  profileDateRange: DateRange;
  buildingName: string;
  buildingGroupName: string;
  buildingGroupId: number;
  eqdistlg: DateRange;
  squareMeterPointerDescription: string =
    "EUI";
  todayDateRange: DateRange;
  thisWeekDateRange: DateRange;
  thisMonthRange: DateRange;
  thisYearRange: DateRange;
  lastYearRange: DateRange
  lastFiveYearRange: DateRange;
  meterTreeDateRange: DateRange;
  equipBreakdown: Table;
  buildingList: any = [];
  groupAllBuildings: any;
  selectedBuilding: number;
  FileDownloadIcon = faDownload;
  meterTreeLoading: boolean;
  tempIntervalid: number;
  tempInterval: any;
  chartdata: any;
  currentYear: any;
  previousYear: any;
  colorMap: ChartColorMapType = ChartColorMap;
  isDone: any = {}

  rows = [];
  columns = [
    { name: "No.", key: "meterId" },
    { name: "Level", key: "level" },
    { name: "Equipment Type", key: "eqType" },
    { name: "Equipment Code", key: "eqCode" },
    { name: "Consumption ( kWh )", key: "value" },
  ];
  tableLoading = true;

  selectedTypes: number[];
  multipleConsump: boolean;
  constructor(
    private headerService: HeaderService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private meterService: MeterService,
    private equipmentBreakdownService: EquipmentBreakdownService,
    private router: Router,
    private ltDashboardService: LtDashboardService,
    private configs: InitialService,
    private thousandSeparator: ThousandSeparatorPipe
  ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = dateGapGenerator(new Date(), 1, 'day', 'minus' );
    }

    this.overallDateRange = this.dateService.thisMonthUpToNow(this.today);
    this.overallDateRange.end = this.today;

    this.meterTreeDateRange = this.dateService.getTodayUpToNow(this.today);

    this.profileDateRange = this.dateService.getLastMonth(this.today);

    this.eqDIstDateRange = this.dateService.thisMonthUpToNow(this.today);

    this.equipmentBreakdownDateRange = this.dateService.thisMonthUpToNow(
      this.today
    );

    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = this.dateService.getLastDaysRange(
      this.today,
      7,
      "days"
    );
    this.thisMonthRange = this.dateService.getLastDaysRange(
      this.today,
      30,
      "days"
    );
    this.thisYearRange = this.dateService.getLastDaysRange(
      this.today,
      12,
      "months"
    );

    this.lastYearRange = this.dateService.getLastyears(this.today);

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.eqdistlg = this.dateService.thisMonthUpToNow(this.today);

    this.weekFirst =
      new Date(this.today).getDate() - new Date(this.today).getDay() + 1;
    this.weekLast = this.weekFirst + 7;

    this.monthFirst = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      1
    );
    this.monthLast = new Date(
      this.today.getFullYear(),
      this.today.getMonth() + 1,
      1
    );

    this.yearFirst = new Date(new Date().getFullYear(), 0, 1);
    this.yearLast = new Date(new Date().getFullYear(), 11, 31);

    this.currentYear = new Date(new Date().setFullYear(new Date().getFullYear()));
    this.previousYear = new Date(new Date().setFullYear(new Date().getFullYear()-1, 4, 1));


    this.route.params.subscribe((params) => {
      this.trendLogTabIndex = 0;
      // this.tabIndex = 0;
      this.buildingId = parseInt(params.id);
      this.equipDistributionLg = null;
      
      // this.getChartDatas();
      // this.setTrendLogData(this.trendLogTabIndex);
      this.appOnInit();
      
    });

    this.route.data.subscribe((data) => {
      this.headerService.electricalDashboardType.next(
        DashboardType.LOW_TENSION
      );
    });
  }

  ngOnInit() {
    // this.getEqBreakdownData(this.equipmentBreakdownDateRange);
    // this.getEqDistribution();
    
    window.dispatchEvent(new Event("resize"));
    
  }

  appOnInit = () => {
    const { tabkey = 0 }: any = this.route.snapshot.queryParams || {};
    this.tabIndex = tabkey;
    this.getBuildingName((isDone) =>{
      if(isDone){
        if(tabkey && tabkey!= 0){
          this.setTabIndex(tabkey);
          this.setTrendLogData(this.trendLogTabIndex);
        }else{
          
          this.getChartDatas();
          this.setTrendLogData(this.trendLogTabIndex);
          this.getEqBreakdownData(this.equipmentBreakdownDateRange);
          this.getEqDistribution();
        }
      }
    })
    
  }

  prepareBreadCrumbData() {
    this.breadCrumbData = [];
    this.breadCrumbData.push({
      url: `electrical-building-group/${this.buildingGroupId}`,
      name: this.buildingGroupName,
    });
    this.breadCrumbData.push({ url: "#", name: this.buildingName });
  }

  exportMeter() {
    const svg: any = document.getElementById("meterTreeSvg").cloneNode(true);
    // const svg: any = parent.querySelector('svg'); 
    const g = svg.querySelector('g') 
    g.setAttribute('transform', 'scale(.7)') 
    saveSvgAsPng(svg, "Meter Tree-"+ new Date().getTime()+'.jpeg', {width: 1440});
  }

  onBreakdownFiltered(event = []) {
    if (event !== null) {
      this.rows = [];
      event.forEach((row, i) => {
        const { scalledNumber, suffix, unit } = abbreviateNumber(row.meter.value, ServiceType.ELECTRICAL);
        this.rows.push({
          meterId: i + 1,
          level: row.level.name,
          eqType: row.eqType.name,
          eqCode: row.eqCode.name,
          value:  row.meter.value ? moneyFormat((row.meter.value / DevicerNumber.electrical).toFixed(DECIMAL_MAP.electricalBreakDown)) : 'N/A' 
          // value: this.thousandSeparator.transform(
          //   fixDecimalNumPrecision(
          //     row.meter.value,
          //     this.configs.siteConfigurations.decimalNumPrecision
          //   )
          // ),
        });
      });
    }
  }

  private getBuildingName(callback: (isDone: boolean) => void) {
    this.initialService.navigationStore.buildings$.subscribe((res) => {
      if (res.length !== 0 && res !== null) {
        let building = this.initialService.navigationStore.getBuilding(
          this.buildingId
        );
        if (building.length !== 0 && !null) {
          this.buildingGroupId = building[0].buildingGroupID;
          this.buildingGroupName =
            this.initialService.navigationStore.getBuildingGroupById(
              this.buildingGroupId
            )[0].description;
          this.headerService.setItem(building[0].buildingName);
          this.headerService.serviceType.next(ServiceType.ELECTRICAL);
          let buildingList =
            this.initialService.navigationStore.getBuildingsByBuildingGroup(
              building[0].buildingGroupID
            );
          this.buildingList = [];
          buildingList = buildingList.filter((x) =>
            x.serviceTypes.some(
              (y) => y.serviceTypeID == ServiceType.ELECTRICAL
            )
          );
          buildingList.forEach((element) => {
            this.buildingList.push({
              name: element.buildingName,
              id: element.buildingID,
            });
          });
          this.selectedBuilding = this.buildingId;
          callback(true)
        }
      }
    });
  }

  private getChartDatas() {
    this.initialService.navigationStore.meterTypes$.subscribe((res) => {
      if (res !== null && res.length !== 0) {
        this.getEqDistribution();
      }
    });
    this.getTrendDaylyData();
    this.getOverallConsumption();
    this.onChangeTrendLogByDate();
  }

  private getEqBreakdownData(daterange: DateRange) {
    this.equipmentBreakdownService
      .requestBuildingData(
        this.buildingId,
        null,
        null,
        null,
        ServiceType.ELECTRICAL,
        this.equipmentBreakdownDateRange.start,
        this.equipmentBreakdownDateRange.end
      )
      .then(
        (data) => {
          this.equipmentBreakdownData = data;
          this.tableLoading = false;

          this.selectedTypes = this.eqTypes.map((x) => x.id);
        },
        (err) => console.log(err)
      );
  }

  _totalChild: any[] = [];
  // calculate = (arr = [], index) =>{
  //   this._totalChild[index] += 1;
  //   const temp = this._totalChild[index];
  //   for (let i = 0; i < arr.length; i++) {
  //     const item: any = arr[i];
  //     if(item.children){
  //       for (let i = 0; i < item.children.length; i++) {
  //         const childItem = item.children[i];
  //         if(childItem.children){
  //           this.calculate(childItem.children, index)
  //         }
  //       }
  //     }
  //     this._totalChild[index] = temp;
  //   }
  // }

  private getMeterTreeData() {
    this.meterTreeLoading = true;
    this.meterService
      .getBuildingMeterTree(this.buildingId, ServiceType.ELECTRICAL)
      .then((res: any) => {
        this.meterTreeData = res;
        // for (let i = 0; i < res.children.length; i++) {
        //   const item = res.children[i];
        //   this._totalChild.push(i+1)
        //   if(item.children){
        //     this.calculate(item.children || [], i+1)
        //   }
          
        // }
        // console.log(res, this._totalChild);
        
        this.meterTreeLoading = false;
      });
  }

  onEqBreakdownFilter(e) {
    this.rows = [];
    this.equipmentBreakdownDateRange = e;
    this.getEqBreakdownData(this.equipmentBreakdownDateRange);
  }

  getTrendDaylyData(dateKey: string = '_todayConsumptionDate') {
    this.isDone.dailyConsumptionData = false;
    this.dailyConsumptionData =
      this.ltDashboardService.getTodaysConsumptionEmptyChart(
        ChartDashboardType.BUILDING_ELECTRICAL
      );
    this.ltDashboardService
      .getBuildingTodaysConsumption(
        ServiceType.ELECTRICAL,
        this[dateKey].start,
        this[dateKey].end,
        this.buildingId,
        ChartDashboardType.BUILDING_ELECTRICAL
      )
      .then((res) => {
        this.dailyConsumptionData = res;
        for (let i = 0; i < this.dailyConsumptionData.data.length; i++) {
          const item = this.dailyConsumptionData.data[i];
          const newValue = item.value / DevicerNumber.electrical
          this.dailyConsumptionData.data[i] = {
            ...item,
            value: item.value ? newValue : null,
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

  getTrendLogs(interval, from , to) {
    // TODO: load empty chart chart
    // this.trendLogData = this.ltDashboardService.getEmptyConsumptionChart(ServiceType.ELECTRICAL, interval);
    this.isDone.trendLogData = false;
    this.ltDashboardService
      .getBuildingConsumptionChart(
        ServiceType.ELECTRICAL,
        from,
        to,
        this.buildingId,
        interval
      )
      .then((res) => {
        this.trendLogData = res;
        this.isDone.trendLogData = true;
        this.trendLogData.chart = {
          ...this.trendLogData.chart,
          formatNumberScale: 0,
          valuefontSize: 16,
          paletteColors: [this.colorMap.electric.secondary],
        }
      });
  }

  get serviceType() {
    return ServiceType;
  }

  getEqDistribution() {
    this.isDone.equipDistribution = false;
    this.ltDashboardService
      .getBuildingEquipmentDistribution(
        ServiceType.ELECTRICAL,
        this.eqDIstDateRange.start,
        this.eqDIstDateRange.end,
        this.buildingId,
        ChartDashboardType.BUILDING_ELECTRICAL,
        DistributionChartType.SMALL,
        ChartGroupType.METER_TYPES
      )
      .then((res) => {
        this.equipDistribution = res;
        this.isDone.equipDistribution = true;
      });
  }

  getEqDistributionLg() {
    this.isDone.equipDistributionLg = false;
    this.ltDashboardService
      .getBuildingEquipmentDistribution(
        ServiceType.ELECTRICAL,
        this.eqdistlg.start,
        this.eqdistlg.end,
        this.buildingId,
        ChartDashboardType.BUILDING_ELECTRICAL,
        DistributionChartType.LARGE,
        ChartGroupType.METER_TYPES
      )
      .then((res) => {
        this.equipDistributionLg = res;
        this.isDone.equipDistributionLg = true;
      });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    this.meterTreeData = null;
    if (this.tabIndex == 0) {
      this.getChartDatas();
    } else if (this.tabIndex == 1) {
      this.equipDistributionLg = {};
      this.getEqDistributionLg();
    } else if (this.tabIndex == 2) {
      this.getEqBreakdownData(this.equipmentBreakdownDateRange);
    } else if (this.tabIndex == 3) {
      this.meterTreeData = null;
      this.getMeterTreeData();
    }
    window.history.pushState(null, null, index!=0 ? `${window.location.pathname}?tabkey=${index}`  : `${window.location.pathname}`);
  }

  public done: boolean = true;
  getColor() {
    return this.done ? "Blue" : "White";
  }

  setConsumpType(event) {
    this.trendLogData = [];
    this.multipleConsump = event;

    this.setTrendLogData(this.trendLogTabIndex);
  }

  setTypesFilter(ids): void {
    this.selectedTypes = ids;

    this.getConsumptionData();
  }

  _colorMap = ['#b30000', '#7c1158', '#4421af', '#1a53ff', '#0d88e6', '#00b7c7', '#5ad45a', '#8be04e', '#ebdc78']
  getConsumptionData(): void {
   if(this.typeChart) {
    this.typeChart.reset();
   }
   let colors = [];

    if (this.trendLogTabIndex == 0 || this.trendLogTabIndex == 1) {
      this.tempIntervalid = 2;
    } else if (this.trendLogTabIndex == 2) {
      this.tempIntervalid = 3;
    } else if (this.trendLogTabIndex == 3) {
      this.tempIntervalid = 4;
    }
    this.ltDashboardService
      .getCategoryTrends(
        this.buildingId,
        this.tempIntervalid,
        this.getDate(this._startDateTrendLogLineChart.start),
        this.getDate(this._startDateTrendLogLineChart.end),
      )
      .subscribe(
        (res: any[]) => {
          if (res.length) {
            const labels = res[0]["data"].map((x) => {
              return {
                label: this.getConvertedDateLabel(x.label, this.dates)
                // label: this.datePipe.transform(this.getConvertedDateLabel(x.label, this.dates), 'MMM-dd')
              }
            });
            // const values = res.filter((x: any) => {
            //   if(this.selectedTypes!==undefined){
            //     return this.selectedTypes.indexOf(x.itemId) > -1
            //   }
            // })
            const sumData: any = [];
            for (let i = 0; i < res.length; i++) {
              const group: any = res[i];
              for (let j = 0; j < group.data.length; j++) {
                const { label, value } = group.data[j];
                if(sumData[j]){
                  sumData[j].value = Number(sumData[j].value || 0) + ( Number(value) || 0);
                }else{
                  sumData.push({label, value})
                }
              }
            }
            res.push({
              itemId: 1,name: "Total",
              data: sumData
            })

            const values  = res.map((x: any, i: any) => {
                const color = this.getColorCode(ChartGroupType.METER_TYPES, x.itemId);
                return {
                  anchorbgcolor:  color,
                  anchorbordercolor:  color,
                  seriesname: x.name,
                  data: x.data.map((d) => {
                    return {
                      value: ((d.value)/DevicerNumber.electrical).toFixed(2),
                      color: color,
                    };
                  }),
                };
              });


            if(this.typeChart){
              if(!colors || colors.length < 1) {
                colors = this._colorMap;
              } else {
                colors = Array.from(new Set(colors));
              }

              this.typeChart.setData(labels, values, colors);
              this.typeChart.dataSource.chart = {
                ...this.typeChart.dataSource.chart,
                "legendItemFontSize": "15",
                "legendBgAlpha": "20",
                "legendItemFontColor": "#ffffff",
              }
              
            }
          }
        },
        (err) => console.log("Err")
      );
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
  _startDateTrendLogLineChart: DateRange = {
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
    
    this._startDateTrendLogLineChart = {start: newStart, end: newEnd}
    if(!this.multipleConsump){
      this.getTrendLogs(this.trendLogTabIndex+1, this.getDate(newStart), this.getDate(newEnd));
    }else{
      this.getConsumptionData()
    }
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
  //   this.trendLogTabIndex = index;

  //   if (!this.multipleConsump) {
  //     switch (index) {
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
    
  //   else this.getConsumptionData();

  // }

  buildingChanged(data) {
    this.rows = [];
    this.equipmentBreakdownData = null;
    if (data.value === "0") {
      this.router.navigateByUrl(
        encodeURI(`electrical-building-group/${this.buildingGroupId}?tabkey=${this.tabIndex}`)
      );
    } else {
      this.router.navigateByUrl(encodeURI(`electrical/${data.value}?tabkey=${this.tabIndex}`));
    }
  }
  _tempOverallConsumptioTotalData: number = 0;
  getOverallConsumption() {
    this.isDone.overallConsumptioTotalData = false;
    this.ltDashboardService
      .getOverallConsumptionBuilding(
        ServiceType.ELECTRICAL,
        this.overallDateRange.start,
        this.overallDateRange.end,
        this.buildingId
      )
      .then((res) => {
        this._tempOverallConsumptioTotalData = res;
        this.overallConsumptioTotalData = fixDecimalNumPrecision(res, 2);
        this.getGfa();
        this.isDone.overallConsumptioTotalData = true;
      });
  }

  getGfa() {
    this.isDone.overallConsumptioSquareData = false;
    this.ltDashboardService
      .getGFABuilding(ServiceType.ELECTRICAL, this.buildingId)
      .then((res) => {
        this.isDone.overallConsumptioSquareData = true;
        const { start, end }: any = this.overallDateRange;
        const daysGap = ((end - start) / (1000 * 60 * 60 * 24)) +  1;
        // const oldEUI = (this.overallConsumptioTotalData == null ||  this.overallConsumptioTotalData == 0) ? null : this.overallConsumptioTotalData / res
        const newEUI = (365/daysGap) * ((this.overallConsumptioTotalData || 0) / res);
        // const { scalledNumber, suffix, unit } = abbreviateNumber(Number(newEUI), ServiceType.MAIN_INCOMER);
        // console.log(newEUI,'---');
        
        if (res == null || res == 0) {
          this.overallConsumptioSquareData = null;
          this.squareMeterPointerDescription =
            "EUI";
        } else {
          this.overallConsumptioSquareData = newEUI;
          this.squareMeterPointerDescription =
            "EUI";
        }
      });
  }

  dateRangeListner(chartType) {
    this.resetTime();
    let dataset;
    switch (chartType) {
      case "eqDist":
        dataset = this.getEqDistribution();
        if (dataset !== null) {
        } else {

        }
        break;
      case "overall":
        dataset = this.getOverallConsumption();
        break;
      case "eqdistlg":
        this.getEqDistributionLg();
        break;
    }
  }

  get dates(): any {
    switch (this.trendLogTabIndex) {
      case 1:
        return {
          from: this.datePipe.transform(
            this.thisMonthRange.start,
            "yyyy/MM/dd"
          ),
          to: this.datePipe.transform(this.thisMonthRange.end, "yyyy/MM/dd"),
        };

      case 2:
        return {
          from: this.datePipe.transform(this.thisYearRange.start, "yyyy/MM/dd"),
          to: this.datePipe.transform(this.thisYearRange.end, "yyyy/MM/dd"),
        };

      case 3:
        return {
          from: this.datePipe.transform(
            this.lastFiveYearRange.start,
            "yyyy/MM/dd"
          ),
          to: this.datePipe.transform(this.lastFiveYearRange.end, "yyyy/MM/dd"),
        };

      default:
        return {
          from: this.datePipe.transform(
            this.thisWeekDateRange.start,
            "yyyy/MM/dd"
          ),
          to: this.datePipe.transform(this.thisWeekDateRange.end, "yyyy/MM/dd"),
        };
    }
  }

  get intervalTime(): any {
    switch (this.trendLogTabIndex) {
      case 1:
        return {
          from: this.datePipe.transform(this.thisMonthRange.start,"yyyy/MM/dd"),
          to: this.datePipe.transform(this.thisMonthRange.end, "yyyy/MM/dd"),
        };

      case 2:
        return {
          from: this.datePipe.transform(this.previousYear, 'yyyy/MM/dd'),
          to: this.datePipe.transform(this.currentYear, 'yyyy/MM/dd')
        };

      case 3:
        return {
          from: this.datePipe.transform(this.lastFiveYearRange.start,"yyyy/MM/dd"),
          to: this.datePipe.transform(this.lastFiveYearRange.end, "yyyy/MM/dd"),
        };

      default:
        return {
          from: this.datePipe.transform(this.thisWeekDateRange.start, "yyyy/MM/dd"),
          to: this.datePipe.transform(this.thisWeekDateRange.end, "yyyy/MM/dd"),
        };
    }
  }

  get eqTypes() {
    let eqTypes = [];

    if (this.equipmentBreakdownData) {
      eqTypes = [
        ...new Map(
          this.equipmentBreakdownData.map((item) => [
            item.eqType.id,
            item.eqType,
          ])
        ).values(),
      ];
    }

    return orderBy(eqTypes, ["name"], ["desc"]);
  }

  private getConvertedDateLabel(date: string, type:DateTypes) {

    switch (type) {
      case DateTypes.DATE:
        return this.datePipe.transform(date, 'MMM-dd');
      case DateTypes.MONTH:
        return this.datePipe.transform(date, 'MMM');
      case DateTypes.YEAR:
        return date;
      default:
        return date;
    }
  }

  /*
    Get color code
  */
  private getColorCode(chartGroupType: ChartGroupType, itemId: number) {
    let item;
    let color;
    switch(chartGroupType) {
      case ChartGroupType.METER:
        return '';
      case ChartGroupType.BUILDING_CATEGORY:
        item = find(this.initialService.navigationStore.buildingCategories, {buildingCategoryID: itemId});
        return this.getDefaultColorCode(item);
      case ChartGroupType.METER_TYPES:
        item = find(this.initialService.navigationStore.meterTypes, {meterTypeID: itemId});
        return this.getDefaultColorCode(item);
      case ChartGroupType.HT_LOOPS:
        return '';
    }
  }

  private getDefaultColorCode(item) {
    let color;
    if(item === undefined || item.attributes.length === 0) {
      return this.configs.config.defaultColorCode;
    } else {
      color = find(item.attributes, {textId: this.configs.config.attributes.COLOR_CODE});
      return color===null || color === undefined?this.configs.config.defaultColorCode:color.value;
    }
  }

  _reload: boolean = true;
  resetTime(){
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
  }

}
