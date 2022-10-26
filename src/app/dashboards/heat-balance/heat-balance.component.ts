import { Component, OnInit } from '@angular/core';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import { HeaderService } from 'src/app/services/header.service';
import { InitialService } from 'src/app/services/initial.service';
import { DateServiceService } from 'src/app/services/date-service.service';
import { GreenmarkDataFetchingService } from 'src/app/services/dashboards/greenmark-data-fetching.service';
import { ChillerDataGenerateService } from 'src/app/services/dashboards/chiller-data-generate.service';
import { ColumnMode, SortType, SelectionType } from '@swimlane/ngx-datatable';
import { GreenMarkFrequency } from 'src/enums/green-mark-frequency.enum';
import { GreenMarkChartType } from '../../../enums/green-mark-chart-type.enum';
import { BehaviorSubject } from 'rxjs';
import { addChartConfiguration, convertStringToArr, getChartMinMax, reduceDataChart } from '../../../util/ChartHelper';

@Component({
  selector: 'app-heat-balance',
  templateUrl: './heat-balance.component.html',
  styleUrls: ['./heat-balance.component.scss']
})
export class HeatBalanceComponent implements OnInit {

  today: Date;
  dateRange: DateRange;
  tabIndex: number;
  plantList: any = [];
  selectedPlant: number;
  heatBalanceDataSource: any;
  chartLoading: boolean;
  tableWidth = new BehaviorSubject<any>('100%');

  columnMode = ColumnMode;
  sortType = SortType;
  selectionType = SelectionType;
  scaleList: Array<any> = [ {name: 'Fixed Scale', id: 1}, {name: 'Auto Scale', id: 2}];
  scaleListSelected: number = 1;

  rows = [];

  constructor(
    private headerService: HeaderService,
    private initialService: InitialService,
    private dateService: DateServiceService,
    private dataFetchingService: GreenmarkDataFetchingService,
    private dataGeneratingService: ChillerDataGenerateService
    ) {
      this.headerService.setItem('Heat Balance');
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
      this.dataFetchingService.getPlants().then(res => {
        this.plantList = res;
        this.selectedPlant = res[0].id;
        this.getHeatBalanceData();
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
    if (this.dateRange.start.getTime() === this.dateRange.end.getTime()) {
      let newEnd = new Date(this.dateRange.end);
      newEnd.setDate(newEnd.getDate() + 1);
      this.dateRange.end = newEnd;
    }
    this.getHeatBalanceData();
  }

  plantChanged(data) {
    this.selectedPlant = data.value;
    this.getHeatBalanceData();
  }

  
  isDone: any = {}

  getHeatBalanceData() {
    this.isDone.heatBalanceDataSource = false
    this.chartLoading = true;
    let dataSource: any = {};
    this.dataFetchingService.fetchHeatBalanceData(this.dateRange, this.selectedPlant, GreenMarkFrequency.OneMinute).then(res => {
      this.rows = res;
      // if (res == null || res.length === 0) {
      //   this.heatBalanceDataSource = this.dataGeneratingService.plotHeatBalanceChart(this.dataGeneratingService.heatBalanceEmptyData(this.dateRange));
      // } else {
        res  = [
          {
            "dateTime": "2022/09/20 00:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:19",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:20",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:21",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:22",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:23",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:24",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:25",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:26",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:27",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:28",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:30",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:32",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:33",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:34",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:35",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:36",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:37",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:38",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:39",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:40",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:41",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:42",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:43",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:44",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:45",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:46",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:47",
            "heat_balance": 40.7
          },
          {
            "dateTime": "2022/09/20 00:48",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 00:49",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 00:50",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/20 00:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 00:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 01:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 02:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 03:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 04:51",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:52",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:53",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:54",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:55",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:56",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:57",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:58",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 04:59",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:00",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:01",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:02",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:03",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:04",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:05",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:06",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:07",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 05:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 05:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:50",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:51",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:52",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:53",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:54",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:55",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:56",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 06:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 06:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 07:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:43",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:44",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:45",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:46",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:47",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:48",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:49",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:50",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 08:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 08:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:03",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/20 09:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:08",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 09:09",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/20 09:10",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/20 09:11",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 09:12",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 09:13",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 09:14",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/20 09:15",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 09:16",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 09:17",
            "heat_balance": 44.4
          },
          {
            "dateTime": "2022/09/20 09:18",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/20 09:19",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 09:20",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 09:21",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 09:22",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:23",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:24",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:25",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:26",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:27",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:28",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:29",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:30",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:31",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:32",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 09:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 09:34",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 09:35",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 09:36",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 09:37",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 09:38",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 09:39",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 09:40",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 09:41",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 09:42",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/20 09:43",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 09:44",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 09:45",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 09:46",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 09:47",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 09:48",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 09:49",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 09:50",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 09:51",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 09:52",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 09:53",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 09:54",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 09:55",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/20 09:56",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 09:57",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 09:58",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 09:59",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 10:00",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/20 10:01",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/20 10:02",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 10:03",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/20 10:04",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 10:05",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 10:06",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 10:07",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/20 10:08",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 10:09",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 10:10",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 10:11",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 10:12",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 10:13",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 10:14",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 10:15",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 10:16",
            "heat_balance": 49.1
          },
          {
            "dateTime": "2022/09/20 10:17",
            "heat_balance": 48.7
          },
          {
            "dateTime": "2022/09/20 10:18",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 10:19",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 10:20",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 10:21",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/20 10:22",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 10:23",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 10:24",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 10:25",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/20 10:26",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 10:27",
            "heat_balance": 46.4
          },
          {
            "dateTime": "2022/09/20 10:28",
            "heat_balance": 48.6
          },
          {
            "dateTime": "2022/09/20 10:29",
            "heat_balance": 48.1
          },
          {
            "dateTime": "2022/09/20 10:30",
            "heat_balance": 44.8
          },
          {
            "dateTime": "2022/09/20 10:31",
            "heat_balance": 44.6
          },
          {
            "dateTime": "2022/09/20 10:32",
            "heat_balance": 44.4
          },
          {
            "dateTime": "2022/09/20 10:33",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 10:34",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 10:35",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 10:36",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 10:37",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 10:38",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 10:39",
            "heat_balance": 45.1
          },
          {
            "dateTime": "2022/09/20 10:40",
            "heat_balance": 45.1
          },
          {
            "dateTime": "2022/09/20 10:41",
            "heat_balance": 45.7
          },
          {
            "dateTime": "2022/09/20 10:42",
            "heat_balance": 45.7
          },
          {
            "dateTime": "2022/09/20 10:43",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/20 10:44",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 10:45",
            "heat_balance": 40.7
          },
          {
            "dateTime": "2022/09/20 10:46",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 10:47",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/20 10:48",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/20 10:49",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 10:50",
            "heat_balance": 45.6
          },
          {
            "dateTime": "2022/09/20 10:51",
            "heat_balance": 45.3
          },
          {
            "dateTime": "2022/09/20 10:52",
            "heat_balance": 44.4
          },
          {
            "dateTime": "2022/09/20 10:53",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 10:54",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 10:55",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 10:56",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 10:57",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 10:58",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/20 10:59",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 11:00",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/20 11:01",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/20 11:02",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/20 11:03",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/20 11:04",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/20 11:05",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 11:06",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 11:07",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 11:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:15",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:16",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:17",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:18",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:19",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:20",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:21",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:22",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:23",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:24",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:27",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:28",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:29",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:37",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:39",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 11:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:00",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:01",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:02",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:03",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:04",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:05",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:06",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:07",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 12:08",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/20 12:09",
            "heat_balance": 47.6
          },
          {
            "dateTime": "2022/09/20 12:10",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/20 12:11",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 12:12",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 12:13",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 12:14",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 12:15",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 12:16",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 12:17",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/20 12:18",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 12:19",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 12:20",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 12:21",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 12:22",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 12:23",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 12:24",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 12:25",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 12:26",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 12:27",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/20 12:28",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/20 12:29",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 12:30",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 12:31",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 12:32",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 12:33",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 12:34",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 12:35",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 12:36",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 12:37",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 12:38",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 12:39",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 12:40",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 12:41",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 12:42",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 12:43",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 12:44",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 12:45",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 12:46",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/20 12:47",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/20 12:48",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 12:49",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 12:50",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 12:51",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 12:52",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 12:53",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 12:54",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/20 12:55",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 12:56",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 12:57",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 12:58",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 12:59",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 13:00",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 13:01",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 13:02",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 13:03",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 13:04",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/20 13:05",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 13:06",
            "heat_balance": 36.900001
          },
          {
            "dateTime": "2022/09/20 13:07",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 13:08",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 13:09",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 13:10",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 13:11",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/20 13:12",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 13:13",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/20 13:14",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/20 13:15",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 13:16",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 13:17",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 13:18",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 13:19",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 13:20",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 13:21",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 13:22",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 13:23",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 13:24",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 13:25",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 13:26",
            "heat_balance": 46.7
          },
          {
            "dateTime": "2022/09/20 13:27",
            "heat_balance": 44
          },
          {
            "dateTime": "2022/09/20 13:28",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/20 13:29",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 13:30",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 13:31",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 13:32",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 13:33",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 13:34",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 13:35",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 13:36",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 13:37",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 13:38",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 13:39",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 13:40",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 13:41",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 13:42",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 13:43",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 13:44",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 13:45",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 13:46",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/20 13:47",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/20 13:48",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 13:49",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/20 13:50",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 13:51",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/20 13:52",
            "heat_balance": 44
          },
          {
            "dateTime": "2022/09/20 13:53",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 13:54",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 13:55",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 13:56",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 13:57",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 13:58",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 13:59",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 14:00",
            "heat_balance": 45.3
          },
          {
            "dateTime": "2022/09/20 14:01",
            "heat_balance": 45.9
          },
          {
            "dateTime": "2022/09/20 14:02",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 14:03",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 14:04",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/20 14:05",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 14:06",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 14:07",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 14:08",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 14:09",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/20 14:10",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 14:11",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/20 14:12",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/20 14:13",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 14:14",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 14:15",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 14:16",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 14:17",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 14:18",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 14:19",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/20 14:20",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/20 14:21",
            "heat_balance": 44.5
          },
          {
            "dateTime": "2022/09/20 14:22",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/20 14:23",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 14:24",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 14:25",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 14:26",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 14:27",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 14:28",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 14:29",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 14:30",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 14:31",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 14:32",
            "heat_balance": 44.6
          },
          {
            "dateTime": "2022/09/20 14:33",
            "heat_balance": 45.3
          },
          {
            "dateTime": "2022/09/20 14:34",
            "heat_balance": 44.8
          },
          {
            "dateTime": "2022/09/20 14:35",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/20 14:36",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 14:37",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 14:38",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 14:39",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 14:40",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 14:41",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/20 14:42",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 14:43",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/20 14:44",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 14:45",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 14:46",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 14:47",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 14:48",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 14:49",
            "heat_balance": 44
          },
          {
            "dateTime": "2022/09/20 14:50",
            "heat_balance": 48.3
          },
          {
            "dateTime": "2022/09/20 14:51",
            "heat_balance": 47.1
          },
          {
            "dateTime": "2022/09/20 14:52",
            "heat_balance": 43.7
          },
          {
            "dateTime": "2022/09/20 14:53",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 14:54",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 14:55",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 14:56",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 14:57",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 14:58",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 14:59",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/20 15:00",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 15:01",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 15:02",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 15:03",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 15:04",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 15:05",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 15:06",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 15:07",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 15:08",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/20 15:09",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 15:10",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 15:11",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 15:12",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 15:13",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 15:14",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/20 15:15",
            "heat_balance": 45
          },
          {
            "dateTime": "2022/09/20 15:16",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/20 15:17",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 15:18",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 15:19",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 15:20",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 15:21",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 15:22",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 15:23",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 15:24",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 15:25",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 15:26",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 15:27",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/20 15:28",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/20 15:29",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/20 15:30",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 15:31",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 15:32",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 15:33",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 15:34",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 15:35",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 15:36",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 15:37",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 15:38",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 15:39",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 15:40",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 15:41",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 15:42",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 15:43",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 15:44",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 15:45",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 15:46",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 15:47",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 15:48",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 15:49",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 15:50",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 15:51",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 15:52",
            "heat_balance": 45
          },
          {
            "dateTime": "2022/09/20 15:53",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/20 15:54",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/20 15:55",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/20 15:56",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 15:57",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 15:58",
            "heat_balance": 44.6
          },
          {
            "dateTime": "2022/09/20 15:59",
            "heat_balance": 45.9
          },
          {
            "dateTime": "2022/09/20 16:00",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/20 16:01",
            "heat_balance": 44.7
          },
          {
            "dateTime": "2022/09/20 16:02",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/20 16:03",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/20 16:04",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 16:05",
            "heat_balance": 40.7
          },
          {
            "dateTime": "2022/09/20 16:06",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/20 16:07",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 16:08",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 16:09",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 16:10",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 16:11",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/20 16:12",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/20 16:13",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/20 16:14",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/20 16:15",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 16:16",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 16:17",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 16:18",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 16:19",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 16:20",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 16:21",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 16:22",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 16:23",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 16:24",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 16:25",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 16:26",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/20 16:27",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 16:28",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 16:29",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 16:30",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 16:31",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 16:32",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 16:33",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 16:34",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 16:35",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 16:36",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 16:37",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/20 16:38",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 16:39",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 16:40",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 16:41",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 16:42",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/20 16:43",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 16:44",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 16:45",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 16:46",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 16:47",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 16:48",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 16:49",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 16:50",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 16:51",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 16:52",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 16:53",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 16:54",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/20 16:55",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/20 16:56",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 16:57",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 16:58",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 16:59",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 17:00",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 17:01",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 17:02",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 17:03",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 17:04",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 17:05",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/20 17:06",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 17:07",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 17:08",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/20 17:09",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/20 17:10",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 17:11",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 17:12",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 17:13",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 17:14",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 17:15",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 17:16",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 17:17",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 17:18",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 17:19",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 17:20",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 17:21",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 17:22",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 17:23",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 17:24",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 17:25",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 17:26",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 17:27",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 17:28",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/20 17:29",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 17:30",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 17:31",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 17:32",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 17:33",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/20 17:34",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 17:35",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 17:36",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 17:37",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 17:38",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 17:39",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 17:40",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 17:41",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 17:42",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 17:43",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 17:44",
            "heat_balance": 46.9
          },
          {
            "dateTime": "2022/09/20 17:45",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/20 17:46",
            "heat_balance": 37.900001
          },
          {
            "dateTime": "2022/09/20 17:47",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 17:48",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 17:49",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 17:50",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 17:51",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 17:52",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/20 17:53",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 17:54",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 17:55",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/20 17:56",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/20 17:57",
            "heat_balance": 35.100001
          },
          {
            "dateTime": "2022/09/20 17:58",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 17:59",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/20 18:00",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/20 18:01",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/20 18:02",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/20 18:03",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/20 18:04",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 18:05",
            "heat_balance": 35.700001
          },
          {
            "dateTime": "2022/09/20 18:06",
            "heat_balance": 35.700001
          },
          {
            "dateTime": "2022/09/20 18:07",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/20 18:08",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 18:09",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 18:10",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 18:11",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 18:12",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/20 18:13",
            "heat_balance": 34.700001
          },
          {
            "dateTime": "2022/09/20 18:14",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/20 18:15",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 18:16",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 18:17",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 18:18",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/20 18:19",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/20 18:20",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/20 18:21",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/20 18:22",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/20 18:23",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 18:24",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 18:25",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 18:26",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 18:27",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 18:28",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 18:29",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 18:30",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/20 18:31",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/20 18:32",
            "heat_balance": 35.000001
          },
          {
            "dateTime": "2022/09/20 18:33",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 18:34",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/20 18:35",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 18:36",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/20 18:37",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/20 18:38",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 18:39",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 18:40",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/20 18:41",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 18:42",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 18:43",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 18:44",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 18:45",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 18:46",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/20 18:47",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/20 18:48",
            "heat_balance": 35.700001
          },
          {
            "dateTime": "2022/09/20 18:49",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/20 18:50",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/20 18:51",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/20 18:52",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 18:53",
            "heat_balance": 35.900001
          },
          {
            "dateTime": "2022/09/20 18:54",
            "heat_balance": 35.600001
          },
          {
            "dateTime": "2022/09/20 18:55",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 18:56",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 18:57",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 18:58",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 18:59",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 19:00",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 19:01",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 19:02",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 19:03",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 19:04",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 19:05",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 19:06",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 19:07",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 19:08",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 19:09",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 19:10",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 19:11",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 19:12",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 19:13",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 19:14",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/20 19:15",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/20 19:16",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 19:17",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 19:18",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 19:19",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 19:20",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 19:21",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 19:22",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 19:23",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 19:24",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 19:25",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 19:26",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/20 19:27",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 19:28",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/20 19:29",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/20 19:30",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/20 19:31",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 19:32",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 19:33",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 19:34",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/20 19:35",
            "heat_balance": 35.900001
          },
          {
            "dateTime": "2022/09/20 19:36",
            "heat_balance": 37.500001
          },
          {
            "dateTime": "2022/09/20 19:37",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/20 19:38",
            "heat_balance": 46.2
          },
          {
            "dateTime": "2022/09/20 19:39",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/20 19:40",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 19:41",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 19:42",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 19:43",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/20 19:44",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 19:45",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/20 19:46",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 19:47",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 19:48",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 19:49",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 19:50",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/20 19:51",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 19:52",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 19:53",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 19:54",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 19:55",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 19:56",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/20 19:57",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/20 19:58",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 19:59",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 20:00",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 20:01",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 20:02",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 20:03",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 20:04",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 20:05",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 20:06",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 20:07",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 20:08",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 20:09",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 20:10",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/20 20:11",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 20:12",
            "heat_balance": 42.600001
          },
          {
            "dateTime": "2022/09/20 20:13",
            "heat_balance": 44.4
          },
          {
            "dateTime": "2022/09/20 20:14",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 20:15",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/20 20:16",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 20:17",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 20:18",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 20:19",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 20:20",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/20 20:21",
            "heat_balance": 36.000001
          },
          {
            "dateTime": "2022/09/20 20:22",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 20:23",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 20:24",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/20 20:25",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/20 20:26",
            "heat_balance": 36.100001
          },
          {
            "dateTime": "2022/09/20 20:27",
            "heat_balance": 37.000001
          },
          {
            "dateTime": "2022/09/20 20:28",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 20:29",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 20:30",
            "heat_balance": 35.900001
          },
          {
            "dateTime": "2022/09/20 20:31",
            "heat_balance": 35.800001
          },
          {
            "dateTime": "2022/09/20 20:32",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 20:33",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 20:34",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 20:35",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 20:36",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/20 20:37",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 20:38",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 20:39",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 20:40",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/20 20:41",
            "heat_balance": 40.7
          },
          {
            "dateTime": "2022/09/20 20:42",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 20:43",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 20:44",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 20:45",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/20 20:46",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/20 20:47",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 20:48",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 20:49",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/20 20:50",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 20:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 20:52",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/20 20:53",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 20:54",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 20:55",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 20:56",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/20 20:57",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/20 20:58",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 20:59",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 21:00",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 21:01",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/20 21:02",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 21:03",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 21:04",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 21:05",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 21:06",
            "heat_balance": 35.700001
          },
          {
            "dateTime": "2022/09/20 21:07",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/20 21:08",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 21:09",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/20 21:10",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 21:11",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 21:12",
            "heat_balance": 35.200001
          },
          {
            "dateTime": "2022/09/20 21:13",
            "heat_balance": 36.100001
          },
          {
            "dateTime": "2022/09/20 21:14",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/20 21:15",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 21:16",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/20 21:17",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 21:18",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 21:19",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/20 21:20",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 21:21",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/20 21:22",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 21:23",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/20 21:24",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/20 21:25",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 21:26",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:27",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 21:28",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 21:29",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 21:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:31",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 21:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:33",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 21:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:35",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 21:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:37",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 21:38",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:39",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 21:40",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:41",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/20 21:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:43",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 21:44",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/20 21:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:46",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/20 21:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:48",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/20 21:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:50",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 21:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:52",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 21:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/20 21:54",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 21:55",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 21:56",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 21:57",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 21:58",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 21:59",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 22:00",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 22:01",
            "heat_balance": 44.6
          },
          {
            "dateTime": "2022/09/20 22:02",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 22:03",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/20 22:04",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 22:05",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 22:06",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/20 22:07",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/20 22:08",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 22:09",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 22:10",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 22:11",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 22:12",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/20 22:13",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 22:14",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/20 22:15",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 22:16",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/20 22:17",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 22:18",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 22:19",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 22:20",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 22:21",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 22:22",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 22:23",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 22:24",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/20 22:25",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 22:26",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 22:27",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 22:28",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 22:29",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 22:30",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/20 22:31",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 22:32",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 22:33",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/20 22:34",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 22:35",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 22:36",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/20 22:37",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 22:38",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 22:39",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 22:40",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 22:41",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 22:42",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/20 22:43",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 22:44",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/20 22:45",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/20 22:46",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 22:47",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/20 22:48",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/20 22:49",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 22:50",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 22:51",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/20 22:52",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 22:53",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/20 22:54",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 22:55",
            "heat_balance": 35.800001
          },
          {
            "dateTime": "2022/09/20 22:56",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 22:57",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/20 22:58",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/20 22:59",
            "heat_balance": 35.700001
          },
          {
            "dateTime": "2022/09/20 23:00",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/20 23:01",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 23:02",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 23:03",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 23:04",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/20 23:05",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 23:06",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 23:07",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/20 23:08",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/20 23:09",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/20 23:10",
            "heat_balance": 35.000001
          },
          {
            "dateTime": "2022/09/20 23:11",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/20 23:12",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/20 23:13",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/20 23:14",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/20 23:15",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 23:16",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 23:17",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/20 23:18",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/20 23:19",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/20 23:20",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 23:21",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 23:22",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 23:23",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 23:24",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/20 23:25",
            "heat_balance": 44.7
          },
          {
            "dateTime": "2022/09/20 23:26",
            "heat_balance": 45
          },
          {
            "dateTime": "2022/09/20 23:27",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/20 23:28",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/20 23:29",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/20 23:30",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/20 23:31",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/20 23:32",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/20 23:33",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 23:34",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 23:35",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/20 23:36",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/20 23:37",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/20 23:38",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/20 23:39",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 23:40",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/20 23:41",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/20 23:42",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/20 23:43",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/20 23:44",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/20 23:45",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/20 23:46",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/20 23:47",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/20 23:48",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/20 23:49",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/20 23:50",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/20 23:51",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/20 23:52",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/20 23:53",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/20 23:54",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/20 23:55",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/20 23:56",
            "heat_balance": 43.7
          },
          {
            "dateTime": "2022/09/20 23:57",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/20 23:58",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/20 23:59",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 00:00",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 00:01",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/21 00:02",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 00:03",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 00:04",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 00:05",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 00:06",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/21 00:07",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/21 00:08",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 00:09",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 00:10",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 00:11",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 00:12",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/21 00:13",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 00:14",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 00:15",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 00:16",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 00:17",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 00:18",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/21 00:19",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 00:20",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 00:21",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 00:22",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 00:23",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 00:24",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 00:25",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 00:26",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/21 00:27",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 00:28",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 00:29",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 00:30",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 00:31",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 00:32",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 00:33",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 00:34",
            "heat_balance": 44.3
          },
          {
            "dateTime": "2022/09/21 00:35",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/21 00:36",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 00:37",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 00:38",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 00:39",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 00:40",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 00:41",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 00:42",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 00:43",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 00:44",
            "heat_balance": 44.4
          },
          {
            "dateTime": "2022/09/21 00:45",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/21 00:46",
            "heat_balance": 45.7
          },
          {
            "dateTime": "2022/09/21 00:47",
            "heat_balance": 44
          },
          {
            "dateTime": "2022/09/21 00:48",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/21 00:49",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 00:50",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 00:51",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 00:52",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 00:53",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/21 00:54",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/21 00:55",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 00:56",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 00:57",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 00:58",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/21 00:59",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 01:00",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 01:01",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 01:02",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 01:03",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 01:04",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 01:05",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 01:06",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/21 01:07",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 01:08",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 01:09",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/21 01:10",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/21 01:11",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/21 01:12",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 01:13",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 01:14",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 01:15",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 01:16",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 01:17",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 01:18",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 01:19",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 01:20",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 01:21",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 01:22",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 01:23",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 01:24",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 01:25",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/21 01:26",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 01:27",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 01:28",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 01:29",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 01:30",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 01:31",
            "heat_balance": 36.2
          },
          {
            "dateTime": "2022/09/21 01:32",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/21 01:33",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/21 01:34",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/21 01:35",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 01:36",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 01:37",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 01:38",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 01:39",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 01:40",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 01:41",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 01:42",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 01:43",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/21 01:44",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/21 01:45",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 01:46",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 01:47",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/21 01:48",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 01:49",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 01:50",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 01:51",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 01:52",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 01:53",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 01:54",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 01:55",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 01:56",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 01:57",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 01:58",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 01:59",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/21 02:00",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 02:01",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 02:02",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 02:03",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 02:04",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 02:05",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 02:06",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 02:07",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 02:08",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/21 02:09",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/21 02:10",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 02:11",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 02:12",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 02:13",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 02:14",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 02:15",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 02:16",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 02:17",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 02:18",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 02:19",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 02:20",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 02:21",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 02:22",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 02:23",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 02:24",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 02:25",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 02:26",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 02:27",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 02:28",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/21 02:29",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/21 02:30",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 02:31",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 02:32",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 02:33",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/21 02:34",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 02:35",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 02:36",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 02:37",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 02:38",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 02:39",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 02:40",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 02:41",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 02:42",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 02:43",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 02:44",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 02:45",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 02:46",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 02:47",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 02:48",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/21 02:49",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/21 02:50",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 02:51",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 02:52",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 02:53",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 02:54",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 02:55",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 02:56",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 02:57",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 02:58",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 02:59",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 03:00",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 03:01",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 03:02",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 03:03",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 03:04",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 03:05",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 03:06",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 03:07",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 03:08",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 03:09",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 03:10",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 03:11",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 03:12",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 03:13",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 03:14",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 03:15",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/21 03:16",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 03:17",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 03:18",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 03:19",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 03:20",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 03:21",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 03:22",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 03:23",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 03:24",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 03:25",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 03:26",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 03:27",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 03:28",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 03:29",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 03:30",
            "heat_balance": 46.2
          },
          {
            "dateTime": "2022/09/21 03:31",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/21 03:32",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 03:33",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 03:34",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 03:35",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 03:36",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 03:37",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 03:38",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 03:39",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 03:40",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 03:41",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 03:42",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/21 03:43",
            "heat_balance": 44.7
          },
          {
            "dateTime": "2022/09/21 03:44",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 03:45",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 03:46",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 03:47",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 03:48",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 03:49",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 03:50",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 03:51",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 03:52",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 03:53",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 03:54",
            "heat_balance": 44.6
          },
          {
            "dateTime": "2022/09/21 03:55",
            "heat_balance": 46.1
          },
          {
            "dateTime": "2022/09/21 03:56",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 03:57",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 03:58",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 03:59",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 04:00",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 04:01",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 04:02",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 04:03",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 04:04",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 04:05",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/21 04:06",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/21 04:07",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 04:08",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 04:09",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 04:10",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 04:11",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 04:12",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 04:13",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 04:14",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 04:15",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 04:16",
            "heat_balance": 44.6
          },
          {
            "dateTime": "2022/09/21 04:17",
            "heat_balance": 44.5
          },
          {
            "dateTime": "2022/09/21 04:18",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 04:19",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 04:20",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 04:21",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 04:22",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 04:23",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 04:24",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 04:25",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 04:26",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 04:27",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/21 04:28",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/21 04:29",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 04:30",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 04:31",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 04:32",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 04:33",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 04:34",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/21 04:35",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 04:36",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 04:37",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/21 04:38",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 04:39",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 04:40",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/21 04:41",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/21 04:42",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 04:43",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 04:44",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 04:45",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 04:46",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/21 04:47",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 04:48",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 04:49",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 04:50",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 04:51",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 04:52",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/21 04:53",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/21 04:54",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 04:55",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 04:56",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 04:57",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 04:58",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 04:59",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 05:00",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 05:01",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/21 05:02",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/21 05:03",
            "heat_balance": 36.4
          },
          {
            "dateTime": "2022/09/21 05:04",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 05:05",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 05:06",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/21 05:07",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/21 05:08",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 05:09",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/21 05:10",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 05:11",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 05:12",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 05:13",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 05:14",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 05:15",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 05:16",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 05:17",
            "heat_balance": 40.2
          },
          {
            "dateTime": "2022/09/21 05:18",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 05:19",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 05:20",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/21 05:21",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/21 05:22",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/21 05:23",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 05:24",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/21 05:25",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 05:26",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 05:27",
            "heat_balance": 38.500001
          },
          {
            "dateTime": "2022/09/21 05:28",
            "heat_balance": 38.600001
          },
          {
            "dateTime": "2022/09/21 05:29",
            "heat_balance": 37.500001
          },
          {
            "dateTime": "2022/09/21 05:30",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 05:31",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 05:32",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 05:33",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 05:34",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 05:35",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 05:36",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/21 05:37",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/21 05:38",
            "heat_balance": 38.500001
          },
          {
            "dateTime": "2022/09/21 05:39",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 05:40",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 05:41",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 05:42",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 05:43",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 05:44",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 05:45",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 05:46",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 05:47",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 05:48",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 05:49",
            "heat_balance": 33.4
          },
          {
            "dateTime": "2022/09/21 05:50",
            "heat_balance": 34.600001
          },
          {
            "dateTime": "2022/09/21 05:51",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 05:52",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 05:53",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 05:54",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 05:55",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 05:56",
            "heat_balance": 34.800001
          },
          {
            "dateTime": "2022/09/21 05:57",
            "heat_balance": 34.300001
          },
          {
            "dateTime": "2022/09/21 05:58",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 05:59",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 06:00",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 06:01",
            "heat_balance": 38.200001
          },
          {
            "dateTime": "2022/09/21 06:02",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 06:03",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 06:04",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 06:05",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 06:06",
            "heat_balance": 33.6
          },
          {
            "dateTime": "2022/09/21 06:07",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 06:08",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 06:09",
            "heat_balance": 35.100001
          },
          {
            "dateTime": "2022/09/21 06:10",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 06:11",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 06:12",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 06:13",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 06:14",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 06:15",
            "heat_balance": 37.500001
          },
          {
            "dateTime": "2022/09/21 06:16",
            "heat_balance": 34.400001
          },
          {
            "dateTime": "2022/09/21 06:17",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 06:18",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 06:19",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 06:20",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 06:21",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 06:22",
            "heat_balance": 37.700001
          },
          {
            "dateTime": "2022/09/21 06:23",
            "heat_balance": 34.400001
          },
          {
            "dateTime": "2022/09/21 06:24",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 06:25",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 06:26",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 06:27",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 06:28",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 06:29",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 06:30",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/21 06:31",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/21 06:32",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 06:33",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 06:34",
            "heat_balance": 37.200001
          },
          {
            "dateTime": "2022/09/21 06:35",
            "heat_balance": 36.600001
          },
          {
            "dateTime": "2022/09/21 06:36",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 06:37",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 06:38",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 06:39",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 06:40",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 06:41",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 06:42",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 06:43",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 06:44",
            "heat_balance": 34.700001
          },
          {
            "dateTime": "2022/09/21 06:45",
            "heat_balance": 34.700001
          },
          {
            "dateTime": "2022/09/21 06:46",
            "heat_balance": 34.200001
          },
          {
            "dateTime": "2022/09/21 06:47",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 06:48",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 06:49",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 06:50",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 06:51",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 06:52",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 06:53",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 06:54",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 06:55",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 06:56",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 06:57",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 06:58",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 06:59",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 07:00",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 07:01",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 07:02",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 07:03",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 07:04",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 07:05",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 07:06",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 07:07",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 07:08",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 07:09",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 07:10",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 07:11",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 07:12",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 07:13",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 07:14",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 07:15",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/21 07:16",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 07:17",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 07:18",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 07:19",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 07:20",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 07:21",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 07:22",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 07:23",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 07:24",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 07:25",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 07:26",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 07:27",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 07:28",
            "heat_balance": 34.400001
          },
          {
            "dateTime": "2022/09/21 07:29",
            "heat_balance": 34.600001
          },
          {
            "dateTime": "2022/09/21 07:30",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 07:31",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 07:32",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 07:33",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 07:34",
            "heat_balance": 33.700001
          },
          {
            "dateTime": "2022/09/21 07:35",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 07:36",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 07:37",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 07:38",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 07:39",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/21 07:40",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 07:41",
            "heat_balance": 33.6
          },
          {
            "dateTime": "2022/09/21 07:42",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 07:43",
            "heat_balance": 34.300001
          },
          {
            "dateTime": "2022/09/21 07:44",
            "heat_balance": 36.800001
          },
          {
            "dateTime": "2022/09/21 07:45",
            "heat_balance": 37.700001
          },
          {
            "dateTime": "2022/09/21 07:46",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 07:47",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 07:48",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 07:49",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 07:50",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/21 07:51",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 07:52",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 07:53",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 07:54",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 07:55",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 07:56",
            "heat_balance": 36
          },
          {
            "dateTime": "2022/09/21 07:57",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 07:58",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 07:59",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 08:00",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 08:01",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 08:02",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 08:03",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 08:04",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/21 08:05",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/21 08:06",
            "heat_balance": 43.7
          },
          {
            "dateTime": "2022/09/21 08:07",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 08:08",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 08:09",
            "heat_balance": 35.100001
          },
          {
            "dateTime": "2022/09/21 08:10",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 08:11",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 08:12",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 08:13",
            "heat_balance": 35.200001
          },
          {
            "dateTime": "2022/09/21 08:14",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 08:15",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 08:16",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 08:17",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 08:18",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 08:19",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 08:20",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/21 08:21",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/21 08:22",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 08:23",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 08:24",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 08:25",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/21 08:26",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 08:27",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 08:28",
            "heat_balance": 39.400001
          },
          {
            "dateTime": "2022/09/21 08:29",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 08:30",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 08:31",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 08:32",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 08:33",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 08:34",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/21 08:35",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 08:36",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 08:37",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 08:38",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 08:39",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 08:40",
            "heat_balance": 38.400001
          },
          {
            "dateTime": "2022/09/21 08:41",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 08:42",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 08:43",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 08:44",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 08:45",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/21 08:46",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 08:47",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 08:48",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/21 08:49",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/21 08:50",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 08:51",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 08:52",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 08:53",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 08:54",
            "heat_balance": 40.1
          },
          {
            "dateTime": "2022/09/21 08:55",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 08:56",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 08:57",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 08:58",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/21 08:59",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/21 09:00",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 09:01",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 09:02",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 09:03",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 09:04",
            "heat_balance": 38.200001
          },
          {
            "dateTime": "2022/09/21 09:05",
            "heat_balance": 38.000001
          },
          {
            "dateTime": "2022/09/21 09:06",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 09:07",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 09:08",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 09:09",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 09:10",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 09:11",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 09:12",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 09:13",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 09:14",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 09:15",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 09:16",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/21 09:17",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 09:18",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 09:19",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 09:20",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 09:21",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 09:22",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 09:23",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 09:24",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 09:25",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 09:26",
            "heat_balance": 38.500001
          },
          {
            "dateTime": "2022/09/21 09:27",
            "heat_balance": 37.000001
          },
          {
            "dateTime": "2022/09/21 09:28",
            "heat_balance": 37.000001
          },
          {
            "dateTime": "2022/09/21 09:29",
            "heat_balance": 37.800001
          },
          {
            "dateTime": "2022/09/21 09:30",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 09:31",
            "heat_balance": 38.100001
          },
          {
            "dateTime": "2022/09/21 09:32",
            "heat_balance": 38.000001
          },
          {
            "dateTime": "2022/09/21 09:33",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 09:34",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 09:35",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 09:36",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 09:37",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 09:38",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 09:39",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 09:40",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 09:41",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 09:42",
            "heat_balance": 36.1
          },
          {
            "dateTime": "2022/09/21 09:43",
            "heat_balance": 34.800001
          },
          {
            "dateTime": "2022/09/21 09:44",
            "heat_balance": 35.000001
          },
          {
            "dateTime": "2022/09/21 09:45",
            "heat_balance": 34.500001
          },
          {
            "dateTime": "2022/09/21 09:46",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 09:47",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 09:48",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 09:49",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 09:50",
            "heat_balance": 34.900001
          },
          {
            "dateTime": "2022/09/21 09:51",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 09:52",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 09:53",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 09:54",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 09:55",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 09:56",
            "heat_balance": 37.300001
          },
          {
            "dateTime": "2022/09/21 09:57",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 09:58",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 09:59",
            "heat_balance": 33.6
          },
          {
            "dateTime": "2022/09/21 10:00",
            "heat_balance": 33.3
          },
          {
            "dateTime": "2022/09/21 10:01",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 10:02",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 10:03",
            "heat_balance": 34.700001
          },
          {
            "dateTime": "2022/09/21 10:04",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 10:05",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 10:06",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 10:07",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:08",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 10:09",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 10:10",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 10:11",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 10:12",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/21 10:13",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/21 10:14",
            "heat_balance": 40.7
          },
          {
            "dateTime": "2022/09/21 10:15",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 10:16",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 10:17",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 10:18",
            "heat_balance": 35.200001
          },
          {
            "dateTime": "2022/09/21 10:19",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 10:20",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:21",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:22",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 10:23",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 10:24",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:25",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 10:26",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 10:27",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 10:28",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 10:29",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 10:30",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 10:31",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 10:32",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 10:33",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 10:34",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 10:35",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:36",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 10:37",
            "heat_balance": 45.8
          },
          {
            "dateTime": "2022/09/21 10:38",
            "heat_balance": 47.9
          },
          {
            "dateTime": "2022/09/21 10:39",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/21 10:40",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 10:41",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 10:42",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 10:43",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 10:44",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 10:45",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 10:46",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 10:47",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 10:48",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/21 10:49",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 10:50",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 10:51",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 10:52",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/21 10:53",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 10:54",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:55",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/21 10:56",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 10:57",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 10:58",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 10:59",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 11:00",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 11:01",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/21 11:02",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 11:03",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 11:04",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 11:05",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 11:06",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 11:07",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 11:08",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 11:09",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 11:10",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 11:11",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 11:12",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 11:13",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 11:14",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/21 11:15",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/21 11:16",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/21 11:17",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 11:18",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 11:19",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 11:20",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 11:21",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/21 11:22",
            "heat_balance": 43.7
          },
          {
            "dateTime": "2022/09/21 11:23",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 11:24",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 11:25",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/21 11:26",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 11:27",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 11:28",
            "heat_balance": 34.100001
          },
          {
            "dateTime": "2022/09/21 11:29",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 11:30",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 11:31",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 11:32",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 11:33",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 11:34",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 11:35",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 11:36",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 11:37",
            "heat_balance": 38.300001
          },
          {
            "dateTime": "2022/09/21 11:38",
            "heat_balance": 37.700001
          },
          {
            "dateTime": "2022/09/21 11:39",
            "heat_balance": 37.900001
          },
          {
            "dateTime": "2022/09/21 11:40",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 11:41",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/21 11:42",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/21 11:43",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 11:44",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 11:45",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/21 11:46",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 11:47",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 11:48",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 11:49",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 11:50",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 11:51",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 11:52",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 11:53",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 11:54",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 11:55",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 11:56",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 11:57",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 11:58",
            "heat_balance": 35.000001
          },
          {
            "dateTime": "2022/09/21 11:59",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 12:00",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/21 12:01",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 12:02",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 12:03",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 12:04",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 12:05",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 12:06",
            "heat_balance": 33.700001
          },
          {
            "dateTime": "2022/09/21 12:07",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 12:08",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 12:09",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 12:10",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 12:11",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 12:12",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 12:13",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/21 12:14",
            "heat_balance": 35.6
          },
          {
            "dateTime": "2022/09/21 12:15",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 12:16",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 12:17",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 12:18",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 12:19",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 12:20",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/21 12:21",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 12:22",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 12:23",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 12:24",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 12:25",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 12:26",
            "heat_balance": 38.400001
          },
          {
            "dateTime": "2022/09/21 12:27",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 12:28",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 12:29",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 12:30",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 12:31",
            "heat_balance": 34.200001
          },
          {
            "dateTime": "2022/09/21 12:32",
            "heat_balance": 33.800001
          },
          {
            "dateTime": "2022/09/21 12:33",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 12:34",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 12:35",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 12:36",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 12:37",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 12:38",
            "heat_balance": 34.600001
          },
          {
            "dateTime": "2022/09/21 12:39",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 12:40",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 12:41",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 12:42",
            "heat_balance": 34.300001
          },
          {
            "dateTime": "2022/09/21 12:43",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 12:44",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 12:45",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 12:46",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 12:47",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 12:48",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 12:49",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 12:50",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 12:51",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 12:52",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 12:53",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 12:54",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 12:55",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 12:56",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 12:57",
            "heat_balance": 38.700001
          },
          {
            "dateTime": "2022/09/21 12:58",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 12:59",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 13:00",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 13:01",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 13:02",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 13:03",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 13:04",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 13:05",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 13:06",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 13:07",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 13:08",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 13:09",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 13:10",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 13:11",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 13:12",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 13:13",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 13:14",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 13:15",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 13:16",
            "heat_balance": 36.900001
          },
          {
            "dateTime": "2022/09/21 13:17",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 13:18",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 13:19",
            "heat_balance": 33.1
          },
          {
            "dateTime": "2022/09/21 13:20",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 13:21",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 13:22",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 13:23",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 13:24",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 13:25",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 13:26",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 13:27",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 13:28",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 13:29",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 13:30",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 13:31",
            "heat_balance": 38.500001
          },
          {
            "dateTime": "2022/09/21 13:32",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 13:33",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 13:34",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 13:35",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/21 13:36",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/21 13:37",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 13:38",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 13:39",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 13:40",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 13:41",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 13:42",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/21 13:43",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 13:44",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 13:45",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 13:46",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 13:47",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 13:48",
            "heat_balance": 39.100001
          },
          {
            "dateTime": "2022/09/21 13:49",
            "heat_balance": 39.000001
          },
          {
            "dateTime": "2022/09/21 13:50",
            "heat_balance": 38.100001
          },
          {
            "dateTime": "2022/09/21 13:51",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 13:52",
            "heat_balance": 35.8
          },
          {
            "dateTime": "2022/09/21 13:53",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/21 13:54",
            "heat_balance": 40.3
          },
          {
            "dateTime": "2022/09/21 13:55",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 13:56",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 13:57",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 13:58",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 13:59",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 14:00",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 14:01",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 14:02",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 14:03",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 14:04",
            "heat_balance": 37.200001
          },
          {
            "dateTime": "2022/09/21 14:05",
            "heat_balance": 38.400001
          },
          {
            "dateTime": "2022/09/21 14:06",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 14:07",
            "heat_balance": 39.600001
          },
          {
            "dateTime": "2022/09/21 14:08",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:09",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:10",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:11",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:12",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:13",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:14",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 14:15",
            "heat_balance": 41.5
          },
          {
            "dateTime": "2022/09/21 14:16",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 14:17",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 14:18",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 14:19",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 14:20",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 14:21",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 14:22",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 14:23",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 14:24",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 14:25",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 14:26",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 14:27",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 14:28",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/21 14:29",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 14:30",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 14:31",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/21 14:32",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 14:33",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 14:34",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 14:35",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 14:36",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 14:37",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 14:38",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 14:39",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/21 14:40",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 14:41",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 14:42",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 14:43",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 14:44",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 14:45",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 14:46",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 14:47",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 14:48",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 14:49",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 14:50",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 14:51",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 14:52",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 14:53",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 14:54",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 14:55",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 14:56",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 14:57",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 14:58",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 14:59",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 15:00",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 15:01",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/21 15:02",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 15:03",
            "heat_balance": 44.5
          },
          {
            "dateTime": "2022/09/21 15:04",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/21 15:05",
            "heat_balance": 46.7
          },
          {
            "dateTime": "2022/09/21 15:06",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 15:07",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 15:08",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 15:09",
            "heat_balance": 41
          },
          {
            "dateTime": "2022/09/21 15:10",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/21 15:11",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/21 15:12",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/21 15:13",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/21 15:14",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/21 15:15",
            "heat_balance": 44.7
          },
          {
            "dateTime": "2022/09/21 15:16",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/21 15:17",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 15:18",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 15:19",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/21 15:20",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 15:21",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 15:22",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 15:23",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 15:24",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 15:25",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 15:26",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 15:27",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 15:28",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/21 15:29",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 15:30",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 15:31",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 15:32",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 15:33",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 15:34",
            "heat_balance": 41.2
          },
          {
            "dateTime": "2022/09/21 15:35",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/21 15:36",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 15:37",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 15:38",
            "heat_balance": 43.5
          },
          {
            "dateTime": "2022/09/21 15:39",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/21 15:40",
            "heat_balance": 45.3
          },
          {
            "dateTime": "2022/09/21 15:41",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/21 15:42",
            "heat_balance": 44
          },
          {
            "dateTime": "2022/09/21 15:43",
            "heat_balance": 44.5
          },
          {
            "dateTime": "2022/09/21 15:44",
            "heat_balance": 45.4
          },
          {
            "dateTime": "2022/09/21 15:45",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 15:46",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 15:47",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 15:48",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 15:49",
            "heat_balance": 41.7
          },
          {
            "dateTime": "2022/09/21 15:50",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 15:51",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/21 15:52",
            "heat_balance": 45.2
          },
          {
            "dateTime": "2022/09/21 15:53",
            "heat_balance": 44.5
          },
          {
            "dateTime": "2022/09/21 15:54",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/21 15:55",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 15:56",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 15:57",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 15:58",
            "heat_balance": 38.500001
          },
          {
            "dateTime": "2022/09/21 15:59",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 16:00",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 16:01",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 16:02",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 16:03",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 16:04",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 16:05",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 16:06",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 16:07",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 16:08",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 16:09",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 16:10",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 16:11",
            "heat_balance": 44.9
          },
          {
            "dateTime": "2022/09/21 16:12",
            "heat_balance": 43.2
          },
          {
            "dateTime": "2022/09/21 16:13",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/21 16:14",
            "heat_balance": 33.8
          },
          {
            "dateTime": "2022/09/21 16:15",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 16:16",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 16:17",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 16:18",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 16:19",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 16:20",
            "heat_balance": 35.7
          },
          {
            "dateTime": "2022/09/21 16:21",
            "heat_balance": 35.5
          },
          {
            "dateTime": "2022/09/21 16:22",
            "heat_balance": 37.400001
          },
          {
            "dateTime": "2022/09/21 16:23",
            "heat_balance": 37.200001
          },
          {
            "dateTime": "2022/09/21 16:24",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 16:25",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 16:26",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 16:27",
            "heat_balance": 44.1
          },
          {
            "dateTime": "2022/09/21 16:28",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 16:29",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 16:30",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 16:31",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 16:32",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 16:33",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 16:34",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 16:35",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 16:36",
            "heat_balance": 35.100001
          },
          {
            "dateTime": "2022/09/21 16:37",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 16:38",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/21 16:39",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/21 16:40",
            "heat_balance": 40.4
          },
          {
            "dateTime": "2022/09/21 16:41",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 16:42",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 16:43",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 16:44",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 16:45",
            "heat_balance": 33.8
          },
          {
            "dateTime": "2022/09/21 16:46",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 16:47",
            "heat_balance": 34.900001
          },
          {
            "dateTime": "2022/09/21 16:48",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 16:49",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 16:50",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 16:51",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 16:52",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 16:53",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 16:54",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 16:55",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 16:56",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 16:57",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 16:58",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 16:59",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 17:00",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 17:01",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 17:02",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/21 17:03",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 17:04",
            "heat_balance": 36.7
          },
          {
            "dateTime": "2022/09/21 17:05",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 17:06",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 17:07",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 17:08",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 17:09",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 17:10",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 17:11",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 17:12",
            "heat_balance": 34.300001
          },
          {
            "dateTime": "2022/09/21 17:13",
            "heat_balance": 37.300001
          },
          {
            "dateTime": "2022/09/21 17:14",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 17:15",
            "heat_balance": 37.100001
          },
          {
            "dateTime": "2022/09/21 17:16",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 17:17",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 17:18",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 17:19",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 17:20",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 17:21",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 17:22",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 17:23",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 17:24",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 17:25",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 17:26",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 17:27",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 17:28",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 17:29",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 17:30",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 17:31",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 17:32",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 17:33",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 17:34",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 17:35",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 17:36",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 17:37",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 17:38",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/21 17:39",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 17:40",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 17:41",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 17:42",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 17:43",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 17:44",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 17:45",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 17:46",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 17:47",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 17:48",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/21 17:49",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 17:50",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 17:51",
            "heat_balance": 33.6
          },
          {
            "dateTime": "2022/09/21 17:52",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 17:53",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 17:54",
            "heat_balance": 43.7
          },
          {
            "dateTime": "2022/09/21 17:55",
            "heat_balance": 43.4
          },
          {
            "dateTime": "2022/09/21 17:56",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 17:57",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 17:58",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 17:59",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 18:00",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 18:01",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 18:02",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 18:03",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 18:04",
            "heat_balance": 33.600001
          },
          {
            "dateTime": "2022/09/21 18:05",
            "heat_balance": 33.600001
          },
          {
            "dateTime": "2022/09/21 18:06",
            "heat_balance": 33.1
          },
          {
            "dateTime": "2022/09/21 18:07",
            "heat_balance": 33.3
          },
          {
            "dateTime": "2022/09/21 18:08",
            "heat_balance": 33.1
          },
          {
            "dateTime": "2022/09/21 18:09",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 18:10",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 18:11",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 18:12",
            "heat_balance": 33.5
          },
          {
            "dateTime": "2022/09/21 18:13",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 18:14",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 18:15",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 18:16",
            "heat_balance": 33.5
          },
          {
            "dateTime": "2022/09/21 18:17",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 18:18",
            "heat_balance": 33.3
          },
          {
            "dateTime": "2022/09/21 18:19",
            "heat_balance": 33.3
          },
          {
            "dateTime": "2022/09/21 18:20",
            "heat_balance": 36.000001
          },
          {
            "dateTime": "2022/09/21 18:21",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 18:22",
            "heat_balance": 32.9
          },
          {
            "dateTime": "2022/09/21 18:23",
            "heat_balance": 33.8
          },
          {
            "dateTime": "2022/09/21 18:24",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 18:25",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 18:26",
            "heat_balance": 41.3
          },
          {
            "dateTime": "2022/09/21 18:27",
            "heat_balance": 39.7
          },
          {
            "dateTime": "2022/09/21 18:28",
            "heat_balance": 36.600001
          },
          {
            "dateTime": "2022/09/21 18:29",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 18:30",
            "heat_balance": 33.1
          },
          {
            "dateTime": "2022/09/21 18:31",
            "heat_balance": 33.6
          },
          {
            "dateTime": "2022/09/21 18:32",
            "heat_balance": 33.8
          },
          {
            "dateTime": "2022/09/21 18:33",
            "heat_balance": 33
          },
          {
            "dateTime": "2022/09/21 18:34",
            "heat_balance": 33.3
          },
          {
            "dateTime": "2022/09/21 18:35",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 18:36",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 18:37",
            "heat_balance": 33.6
          },
          {
            "dateTime": "2022/09/21 18:38",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 18:39",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 18:40",
            "heat_balance": 33.100001
          },
          {
            "dateTime": "2022/09/21 18:41",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 18:42",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 18:43",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 18:44",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 18:45",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 18:46",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 18:47",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 18:48",
            "heat_balance": 33.4
          },
          {
            "dateTime": "2022/09/21 18:49",
            "heat_balance": 33.4
          },
          {
            "dateTime": "2022/09/21 18:50",
            "heat_balance": 33.4
          },
          {
            "dateTime": "2022/09/21 18:51",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 18:52",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 18:53",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 18:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 18:55",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 18:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 18:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 18:58",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 18:59",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 19:00",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 19:01",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 19:02",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 19:03",
            "heat_balance": 38.900001
          },
          {
            "dateTime": "2022/09/21 19:04",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 19:05",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 19:06",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 19:07",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 19:08",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 19:09",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 19:10",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 19:11",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 19:12",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 19:13",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 19:14",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 19:15",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 19:16",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 19:17",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 19:18",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 19:19",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 19:20",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 19:21",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 19:22",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 19:23",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 19:24",
            "heat_balance": 42.5
          },
          {
            "dateTime": "2022/09/21 19:25",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 19:26",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 19:27",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 19:28",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 19:29",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 19:30",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 19:31",
            "heat_balance": 33
          },
          {
            "dateTime": "2022/09/21 19:32",
            "heat_balance": 33.2
          },
          {
            "dateTime": "2022/09/21 19:33",
            "heat_balance": 33.4
          },
          {
            "dateTime": "2022/09/21 19:34",
            "heat_balance": 34.300001
          },
          {
            "dateTime": "2022/09/21 19:35",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 19:36",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 19:37",
            "heat_balance": 35.100001
          },
          {
            "dateTime": "2022/09/21 19:38",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 19:39",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 19:40",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 19:41",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 19:42",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 19:43",
            "heat_balance": 37.200001
          },
          {
            "dateTime": "2022/09/21 19:44",
            "heat_balance": 34.500001
          },
          {
            "dateTime": "2022/09/21 19:45",
            "heat_balance": 34.500001
          },
          {
            "dateTime": "2022/09/21 19:46",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 19:47",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 19:48",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 19:49",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 19:50",
            "heat_balance": 33.200001
          },
          {
            "dateTime": "2022/09/21 19:51",
            "heat_balance": 38.900001
          },
          {
            "dateTime": "2022/09/21 19:52",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 19:53",
            "heat_balance": 38
          },
          {
            "dateTime": "2022/09/21 19:54",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 19:55",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 19:56",
            "heat_balance": 38.8
          },
          {
            "dateTime": "2022/09/21 19:57",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 19:58",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 19:59",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 20:00",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 20:01",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 20:02",
            "heat_balance": 42.1
          },
          {
            "dateTime": "2022/09/21 20:03",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 20:04",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 20:05",
            "heat_balance": 34.200001
          },
          {
            "dateTime": "2022/09/21 20:06",
            "heat_balance": 33.900001
          },
          {
            "dateTime": "2022/09/21 20:07",
            "heat_balance": 33.100001
          },
          {
            "dateTime": "2022/09/21 20:08",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 20:09",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 20:10",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 20:11",
            "heat_balance": 34.700001
          },
          {
            "dateTime": "2022/09/21 20:12",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 20:13",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 20:14",
            "heat_balance": 44.2
          },
          {
            "dateTime": "2022/09/21 20:15",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 20:16",
            "heat_balance": 37.800001
          },
          {
            "dateTime": "2022/09/21 20:17",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 20:18",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 20:19",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 20:20",
            "heat_balance": 37.100001
          },
          {
            "dateTime": "2022/09/21 20:21",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 20:22",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 20:23",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/21 20:24",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 20:25",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 20:26",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 20:27",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 20:28",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 20:29",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/21 20:30",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 20:31",
            "heat_balance": 38.800001
          },
          {
            "dateTime": "2022/09/21 20:32",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 20:33",
            "heat_balance": 37.2
          },
          {
            "dateTime": "2022/09/21 20:34",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 20:35",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 20:36",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 20:37",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 20:38",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 20:39",
            "heat_balance": 26
          },
          {
            "dateTime": "2022/09/21 20:40",
            "heat_balance": 39.9
          },
          {
            "dateTime": "2022/09/21 20:41",
            "heat_balance": 41.6
          },
          {
            "dateTime": "2022/09/21 20:42",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/21 20:43",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 20:44",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 20:45",
            "heat_balance": 36.3
          },
          {
            "dateTime": "2022/09/21 20:46",
            "heat_balance": 39.2
          },
          {
            "dateTime": "2022/09/21 20:47",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 20:48",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 20:49",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 20:50",
            "heat_balance": 39.8
          },
          {
            "dateTime": "2022/09/21 20:51",
            "heat_balance": 43.3
          },
          {
            "dateTime": "2022/09/21 20:52",
            "heat_balance": 45.3
          },
          {
            "dateTime": "2022/09/21 20:53",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 20:54",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 20:55",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 20:56",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 20:57",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 20:58",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 20:59",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 21:00",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 21:01",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 21:02",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 21:03",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 21:04",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 21:05",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 21:06",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 21:07",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 21:08",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 21:09",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 21:10",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 21:11",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 21:12",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 21:13",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 21:14",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 21:15",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 21:16",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 21:17",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 21:18",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 21:19",
            "heat_balance": 38.2
          },
          {
            "dateTime": "2022/09/21 21:20",
            "heat_balance": 37.500001
          },
          {
            "dateTime": "2022/09/21 21:21",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 21:22",
            "heat_balance": 40.6
          },
          {
            "dateTime": "2022/09/21 21:23",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/21 21:24",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 21:25",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 21:26",
            "heat_balance": 36.6
          },
          {
            "dateTime": "2022/09/21 21:27",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 21:28",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 21:29",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 21:30",
            "heat_balance": 37.200001
          },
          {
            "dateTime": "2022/09/21 21:31",
            "heat_balance": 36.900001
          },
          {
            "dateTime": "2022/09/21 21:32",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 21:33",
            "heat_balance": 35.9
          },
          {
            "dateTime": "2022/09/21 21:34",
            "heat_balance": 43.6
          },
          {
            "dateTime": "2022/09/21 21:35",
            "heat_balance": 41.8
          },
          {
            "dateTime": "2022/09/21 21:36",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 21:37",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 21:38",
            "heat_balance": 40.8
          },
          {
            "dateTime": "2022/09/21 21:39",
            "heat_balance": 43
          },
          {
            "dateTime": "2022/09/21 21:40",
            "heat_balance": 40.500001
          },
          {
            "dateTime": "2022/09/21 21:41",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 21:42",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 21:43",
            "heat_balance": 33.7
          },
          {
            "dateTime": "2022/09/21 21:44",
            "heat_balance": 33.5
          },
          {
            "dateTime": "2022/09/21 21:45",
            "heat_balance": 36.5
          },
          {
            "dateTime": "2022/09/21 21:46",
            "heat_balance": 40.5
          },
          {
            "dateTime": "2022/09/21 21:47",
            "heat_balance": 37
          },
          {
            "dateTime": "2022/09/21 21:48",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 21:49",
            "heat_balance": 41.4
          },
          {
            "dateTime": "2022/09/21 21:50",
            "heat_balance": 43.1
          },
          {
            "dateTime": "2022/09/21 21:51",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 21:52",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 21:53",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 21:54",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 21:55",
            "heat_balance": 35.200001
          },
          {
            "dateTime": "2022/09/21 21:56",
            "heat_balance": 35
          },
          {
            "dateTime": "2022/09/21 21:57",
            "heat_balance": 38.9
          },
          {
            "dateTime": "2022/09/21 21:58",
            "heat_balance": 42.3
          },
          {
            "dateTime": "2022/09/21 21:59",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 22:00",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 22:01",
            "heat_balance": 40.9
          },
          {
            "dateTime": "2022/09/21 22:02",
            "heat_balance": 41.1
          },
          {
            "dateTime": "2022/09/21 22:03",
            "heat_balance": 38.200001
          },
          {
            "dateTime": "2022/09/21 22:04",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 22:05",
            "heat_balance": 36.9
          },
          {
            "dateTime": "2022/09/21 22:06",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 22:07",
            "heat_balance": 37.400001
          },
          {
            "dateTime": "2022/09/21 22:08",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 22:09",
            "heat_balance": 39.5
          },
          {
            "dateTime": "2022/09/21 22:10",
            "heat_balance": 38.4
          },
          {
            "dateTime": "2022/09/21 22:11",
            "heat_balance": 38.6
          },
          {
            "dateTime": "2022/09/21 22:12",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 22:13",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 22:14",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 22:15",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 22:16",
            "heat_balance": 37.1
          },
          {
            "dateTime": "2022/09/21 22:17",
            "heat_balance": 38.7
          },
          {
            "dateTime": "2022/09/21 22:18",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 22:19",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 22:20",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 22:21",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 22:22",
            "heat_balance": 36.8
          },
          {
            "dateTime": "2022/09/21 22:23",
            "heat_balance": 34.400001
          },
          {
            "dateTime": "2022/09/21 22:24",
            "heat_balance": 34.6
          },
          {
            "dateTime": "2022/09/21 22:25",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 22:26",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 22:27",
            "heat_balance": 37.9
          },
          {
            "dateTime": "2022/09/21 22:28",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 22:29",
            "heat_balance": 34.5
          },
          {
            "dateTime": "2022/09/21 22:30",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 22:31",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 22:32",
            "heat_balance": 41.9
          },
          {
            "dateTime": "2022/09/21 22:33",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 22:34",
            "heat_balance": 34.9
          },
          {
            "dateTime": "2022/09/21 22:35",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 22:36",
            "heat_balance": 37.4
          },
          {
            "dateTime": "2022/09/21 22:37",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 22:38",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 22:39",
            "heat_balance": 34.1
          },
          {
            "dateTime": "2022/09/21 22:40",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 22:41",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 22:42",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 22:43",
            "heat_balance": 34.3
          },
          {
            "dateTime": "2022/09/21 22:44",
            "heat_balance": 33.9
          },
          {
            "dateTime": "2022/09/21 22:45",
            "heat_balance": 34.2
          },
          {
            "dateTime": "2022/09/21 22:46",
            "heat_balance": 37.5
          },
          {
            "dateTime": "2022/09/21 22:47",
            "heat_balance": 37.8
          },
          {
            "dateTime": "2022/09/21 22:48",
            "heat_balance": 38.3
          },
          {
            "dateTime": "2022/09/21 22:49",
            "heat_balance": 42.9
          },
          {
            "dateTime": "2022/09/21 22:50",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 22:51",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 22:52",
            "heat_balance": 35.1
          },
          {
            "dateTime": "2022/09/21 22:53",
            "heat_balance": 35.2
          },
          {
            "dateTime": "2022/09/21 22:54",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 22:55",
            "heat_balance": 39
          },
          {
            "dateTime": "2022/09/21 22:56",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 22:57",
            "heat_balance": 42.7
          },
          {
            "dateTime": "2022/09/21 22:58",
            "heat_balance": 42.4
          },
          {
            "dateTime": "2022/09/21 22:59",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 23:00",
            "heat_balance": 43.9
          },
          {
            "dateTime": "2022/09/21 23:01",
            "heat_balance": 43.8
          },
          {
            "dateTime": "2022/09/21 23:02",
            "heat_balance": 39.6
          },
          {
            "dateTime": "2022/09/21 23:03",
            "heat_balance": 37.7
          },
          {
            "dateTime": "2022/09/21 23:04",
            "heat_balance": 37.6
          },
          {
            "dateTime": "2022/09/21 23:05",
            "heat_balance": 37.3
          },
          {
            "dateTime": "2022/09/21 23:06",
            "heat_balance": 34.7
          },
          {
            "dateTime": "2022/09/21 23:07",
            "heat_balance": 35.4
          },
          {
            "dateTime": "2022/09/21 23:08",
            "heat_balance": 34.8
          },
          {
            "dateTime": "2022/09/21 23:09",
            "heat_balance": 34.900001
          },
          {
            "dateTime": "2022/09/21 23:10",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 23:11",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 23:12",
            "heat_balance": 42.2
          },
          {
            "dateTime": "2022/09/21 23:13",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/21 23:14",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 23:15",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 23:16",
            "heat_balance": 35.3
          },
          {
            "dateTime": "2022/09/21 23:17",
            "heat_balance": 34.400001
          },
          {
            "dateTime": "2022/09/21 23:18",
            "heat_balance": 33.500001
          },
          {
            "dateTime": "2022/09/21 23:19",
            "heat_balance": 34
          },
          {
            "dateTime": "2022/09/21 23:20",
            "heat_balance": 34.4
          },
          {
            "dateTime": "2022/09/21 23:21",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 23:22",
            "heat_balance": 42.6
          },
          {
            "dateTime": "2022/09/21 23:23",
            "heat_balance": 42.8
          },
          {
            "dateTime": "2022/09/21 23:24",
            "heat_balance": 42
          },
          {
            "dateTime": "2022/09/21 23:25",
            "heat_balance": 38.1
          },
          {
            "dateTime": "2022/09/21 23:26",
            "heat_balance": 39.4
          },
          {
            "dateTime": "2022/09/21 23:27",
            "heat_balance": 39.1
          },
          {
            "dateTime": "2022/09/21 23:28",
            "heat_balance": 39.3
          },
          {
            "dateTime": "2022/09/21 23:29",
            "heat_balance": 38.5
          },
          {
            "dateTime": "2022/09/21 23:30",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:31",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:32",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:33",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:34",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:35",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:36",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:37",
            "heat_balance": 50
          },
          {
            "dateTime": "2022/09/21 23:38",
            "heat_balance": 40
          },
          {
            "dateTime": "2022/09/21 23:39",
            "heat_balance": 12
          },
          {
            "dateTime": "2022/09/21 23:40",
            "heat_balance": 30
          },
          {
            "dateTime": "2022/09/21 23:41",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:42",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:43",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:44",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:45",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:46",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:47",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:48",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:49",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:50",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:51",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:52",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:53",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:54",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:55",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:56",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:57",
            "heat_balance": null
          },
          {
            "dateTime": "2022/09/21 23:58",
            "heat_balance": 30
          },
          {
            "dateTime": "2022/09/21 23:59",
            "heat_balance": 30
          }
        ];
        
        dataSource = this.dataGeneratingService.plotHeatBalanceChart(res, this.dateRange);
        dataSource.datasetTemp = JSON.parse( JSON.stringify( dataSource.dataset));
        dataSource.chart = addChartConfiguration(dataSource.chart, true);
        const { dataset } = dataSource;
        for (let i = 0; i < dataset.length; i++) {
          dataset[i].tempColor = "007bff";
          dataset[i] = {
            ...dataset[i],
            data: convertStringToArr(dataset[i].data, dataset[i].tempColor),
            color: '#000000',
          }
        }
        dataSource.dataset = dataset;
        dataSource.chart = {
          ...dataSource.chart
        }
        this.heatBalanceDataSource = dataSource;

        this.setMaxYAxis(this.scaleListSelected);
      // }
      this.chartLoading = false;
      this.isDone.heatBalanceDataSource = true;
    });
  }

  exportToExcel() {
    this.dataFetchingService.exportChart(this.dateRange, GreenMarkFrequency.OneMinute, GreenMarkChartType.HeatBalance, this.selectedPlant);
  }

  scaleChanged({value}) {
    this.scaleListSelected = value;
    this.setMaxYAxis(this.scaleListSelected);
  }
  
  setMaxYAxis(value) {
    if(this.heatBalanceDataSource.chart && value){
      if(value == 1){
        this.heatBalanceDataSource.chart.yAxisMinValue = -15;
        this.heatBalanceDataSource.chart.yAxisMaxValue = 15;
        const { dataset } = this.heatBalanceDataSource;
        for (let i = 0; i < dataset.length; i++) {
          let { data = '', seriesname, color } = dataset[i];
          data  = reduceDataChart(data, this.heatBalanceDataSource.chart.yAxisMinValue, this.heatBalanceDataSource.chart.yAxisMaxValue);
          this.heatBalanceDataSource.dataset = [{data, seriesname, color}];
        }
      }else{
        let { dataset = [] } = this.heatBalanceDataSource;
        if(dataset.length > 0){
          dataset = dataset[0];
          let { max, min } = getChartMinMax(dataset, 'value');
          if(min) min = min.toFixed(1);
          if(max) max = max.toFixed(1);
          this.heatBalanceDataSource.chart.yAxisMinValue = min || undefined;
          this.heatBalanceDataSource.chart.yAxisMaxValue = max || undefined;
          this.heatBalanceDataSource.dataset = this.heatBalanceDataSource.datasetTemp;
        }
      }
    }    
  }


}
