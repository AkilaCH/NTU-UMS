import { abbreviateNumber, fixDecimalNumPrecision, getChartMinMax, reduceDataChart } from 'src/util/ChartHelper';
import { FormulaFrequency } from './../../../enums/FormulaFrequency';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { HttpService } from 'src/app/services/http.service';
import { DateServiceService } from '../../services/date-service.service';
import { DatePipe, formatDate } from '@angular/common';
import { InitialService } from '../../services/initial.service';
import { GreenmarkDataFetchingService } from 'src/app/services/dashboards/greenmark-data-fetching.service';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
@Component({
  selector: 'app-chiller-plant',
  templateUrl: './chiller-plant.component.html',
  styleUrls: ['./chiller-plant.component.scss']
})
export class ChillerPlantComponent implements OnInit {

  monthlyChange = false;
  chillerId: number;
  today: Date;
  tabIndex = 0;
  plantList: any;
  selectedPlant: number;
  enegeryConsumptionDataSource: any = {};
  plantEffieciencyDataSource: any = {};
  heatBalanceDataSource: any = {};
  effieciencyTrendDataSource: any = {};
  scaleListHeatBalance: Array<any> = [ {name: 'Fixed Scale', id: 1}, {name: 'Auto Scale', id: 2},];
  scaleListHeatBalanceSelected: number = 1;
  scaleListEficiencySelected: number = 1;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private dateService: DateServiceService,
    private dataFetchingService: GreenmarkDataFetchingService,
    private datePipe: DatePipe,
    private initialService: InitialService,
    private configs: InitialService,
    private thousandSeparator: ThousandSeparatorPipe
    ) {
      this.headerService.setItem('Chiller Plant Overview');
      this.headerService.setBoardLevel(2);
    }

  ngOnInit() {
    this.dataFetchingService.getPlants().then(res => {
      this.plantList = res;
      this.chillerId = res[0].id;
      this.getPlantEfficency();
      this.getAvgHeatBalance();
      this.getPlantEffeciencyTrend();
      this.getEnergyDistribution(this.monthlyChange);
    });

    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }

  generatePlantEfficencyChartData(value) {
    return [{ data: [{ value }] }];
  }

  plotPlantEfficencyChart(res) {
    this.plantEffieciencyDataSource.pointers = {
      pointer: [
        {
          value: res[0].data.length !== 0?res[0].data[0].value:null
        }
      ]
    };
    this.plantEffieciencyDataSource.chart = this.configs.chartConfigurations.planatefficency;
    this.plantEffieciencyDataSource.chart.decimals = 3;
    this.plantEffieciencyDataSource.colorrange = this.configs.chartConfigurations.plantefficencyColorRange;
  }

  isDone: any = {}
  getPlantEfficency() {
    this.plotPlantEfficencyChart(this.generatePlantEfficencyChartData(0));
    this.plantEffieciencyDataSource = {};
    this.isDone.plantEffieciencyDataSource = false;
    this.dataService.get(
      this.configs.endPoints['chiller-endpoint-1'],
      {
        siteId: 1,
        plantId: this.chillerId,
        frequencyId: FormulaFrequency.OneMinute
      }).subscribe(res => {
        if (res == null || res.length === 0) {
          this.plotPlantEfficencyChart(this.generatePlantEfficencyChartData(0));
        } else {
          this.plotPlantEfficencyChart(res);
        }
        this.isDone.plantEffieciencyDataSource =  true;
      },
        err => {
          this.plotPlantEfficencyChart(this.generatePlantEfficencyChartData(0));
          this.isDone.plantEffieciencyDataSource =  true;
        });
  }

  generateAvgHeatBalanceChartData(startTime, endTime) {
    const t = [{ data: [] }];
    const st = new Date();
    st.setHours(0);
    st.setMinutes(0);
    st.setSeconds(0);

    const now = new Date();
    while (now > st) {
      const date = new Date(st);
      t[0].data.push({ label: date, value: null });
      st.setHours(st.getHours() + 1);
    }
    return t;
  }

  plotAvgHeatBalanceChartData(res) {
    this.heatBalanceDataSource = {};
    const category = [];
    const data = [];
    res[0].data.forEach(element => {
      category.push({ label: element.label});
      data.push({ value: element.value });
    });

    this.heatBalanceDataSource.chart = this.configs.chartConfigurations.plantHeatbalance;
    // this.heatBalanceDataSource.chart.slantLabel = '0';
    this.heatBalanceDataSource.categories = [{ category }];
    this.heatBalanceDataSource.dataset = [{ data }];
    this.heatBalanceDataSource.datasetTemp = JSON.parse(JSON.stringify([{ data }]));
    this.heatBalanceDataSource.chart.plotToolText = 'Time: $label{br}Heat Balance: $dataValue';
    this.setMaxYAxis(this.scaleListHeatBalanceSelected, 'heatBalanceDataSource');
  }

  getAvgHeatBalance() {
    this.isDone.heatBalanceDataSource = false;
    this.plotAvgHeatBalanceChartData(this.generateAvgHeatBalanceChartData(null, null));
    this.dataService.get(
      this.configs.endPoints['chiller-endpoint-2'],
      {
        siteId: 1,
        plantId: this.chillerId,
        frequencyId: FormulaFrequency.OneMinute,
        startDate: this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).start, 'yyyy/M/d hh:mm a'),
        endDate: this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).end, 'yyyy/M/d hh:mm a'),
      }).subscribe(res => {
        if (res == null || res.length === 0) {
          this.plotAvgHeatBalanceChartData(this.generateAvgHeatBalanceChartData(null, null));
        } else {
          this.plotAvgHeatBalanceChartData(res);
        }
        this.isDone.heatBalanceDataSource = true;
      },
        err => {
          this.plotAvgHeatBalanceChartData(this.generateAvgHeatBalanceChartData(null, null));
          this.isDone.heatBalanceDataSource = true;
        });
  }

  generatePlantEffeciencyTrendDate(startDate, endDate) {
    const dataSet = [{ data: [] }];
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);

    const now = new Date();
    while (now > startTime) {
      const date = new Date(startTime);
      dataSet[0].data.push({ label: date, value: null });
      startTime.setHours(startTime.getHours() + 1);
    }
    return dataSet;
  }

  plotPlantEffeciencyTrendDate(res) {
    const category = [];
    const data = [];
    res[0].data.forEach(element => {
      category.push({ label: element.label});
      data.push({ value: element.value });
    });

    this.effieciencyTrendDataSource.chart = this.configs.chartConfigurations.effecenctTrend;
    this.effieciencyTrendDataSource.chart.plotToolText = 'Time: $label{br}Efficiency: $dataValue kW/RT';
    this.effieciencyTrendDataSource.categories = [{ category }];
    this.effieciencyTrendDataSource.dataset = [{ data }];
    this.effieciencyTrendDataSource.datasetTemp = [{ data }];
    this.setMaxYAxis(this.scaleListEficiencySelected, 'effieciencyTrendDataSource');
  }

  getPlantEffeciencyTrend() {
    this.plotPlantEffeciencyTrendDate(this.generatePlantEffeciencyTrendDate(null, null));
    this.effieciencyTrendDataSource = {};
    this.isDone.effieciencyTrendDataSource =  false;
    this.dataService.get(
      this.configs.endPoints['chiller-endpoint-4'],
      {
        siteId: 1,
        plantId: this.chillerId,
        frequencyId: FormulaFrequency.OneMinute,
        startDate: this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).start, 'yyyy/M/d hh:mm a'),
        endDate: this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).end, 'yyyy/M/d hh:mm a'),
      }).subscribe(res => {
        if (res == null || res.length === 0) {
          this.plotPlantEffeciencyTrendDate(this.generatePlantEffeciencyTrendDate(null, null));
        } else {
          this.plotPlantEffeciencyTrendDate(res);
        }
        this.isDone.effieciencyTrendDataSource = true;
      },
        err => {
          this.plotPlantEffeciencyTrendDate(this.generatePlantEffeciencyTrendDate(null, null));
          this.isDone.effieciencyTrendDataSource = true;
        });
  }

  getEnergyDistribution(type) {
    let dateRange = null;
    let exportName;
    if (type) {
      dateRange = this.dateService.getThisFullYear(this.today);
      exportName = 'Yearly';
    } else {
      dateRange = this.dateService.getThisMonth(this.today);
      exportName = 'Monthly';
    }
    this.enegeryConsumptionDataSource = {};
    this.isDone.enegeryConsumptionDataSource =  false;
    this.dataService.get(
      this.configs.endPoints['chiller-endpoint-3'],
      {
        siteId: 1,
        plantId: this.chillerId,
        startDate: this.datePipe.transform(dateRange.start, 'yyyy/M/d'),
        endDate: this.datePipe.transform(dateRange.end, 'yyyy/M/d'),
      }).subscribe(res => {
        this.isDone.enegeryConsumptionDataSource =  true;
        const data = [];
        let tot = 0;
        res.forEach(element => {
          tot += element.data[0].value;
        });

        res.forEach(element => {
          data.push({
            label: element.name,
            value: element.data[0].value,
            toolText: `Equipment: $label{br}Consumption: ${this.thousandSeparator.transform(element.data[0].value)} kWh`
          });
        });
        const { scalledNumber, suffix } = abbreviateNumber(tot, undefined);
        this.enegeryConsumptionDataSource.chart = this.configs.chartConfigurations.energyDist;
        this.enegeryConsumptionDataSource.data = data;
        // this.enegeryConsumptionDataSource.chart.plotToolText = 'Equipment: $label{br}Consumption: $dataValue kWh';
        this.enegeryConsumptionDataSource.chart.defaultCenterLabel = 'Total Energy: ' + scalledNumber+suffix + ' kWh';
        this.enegeryConsumptionDataSource.chart.exportFileName = `Energy Distribution ${exportName}`;
      },
        err => {
          this.isDone.enegeryConsumptionDataSource =  true;
        });
  }

  chillerChanged(event) {
    this.chillerId = event.value;
    this.getPlantEfficency();
    this.getAvgHeatBalance();
    this.getPlantEffeciencyTrend();
    this.getEnergyDistribution(this.monthlyChange);
  }

  monthlyToggle(event) {
    this.monthlyChange = event;
    this.getEnergyDistribution(event);
  }

  last7Days() {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = this.today;
      d.setDate(d.getDate() - i);
      result.push({ label: this.datePipe.transform(d, 'yyyy-MM-dd') });
    }
    return result.reverse();
  }

  scaleEficiencyChanged({value}) {
    this.scaleListEficiencySelected = value;
    this.setMaxYAxis(this.scaleListEficiencySelected, 'effieciencyTrendDataSource');
  }
  
  scaleHeatBalanceChanged({value}) {
    this.scaleListHeatBalanceSelected = value;
    this.setMaxYAxis(this.scaleListHeatBalanceSelected, 'heatBalanceDataSource');
  }

  
  setMaxYAxis(value, key = 'heatBalanceDataSource') {
    if(this[key].chart && value){
      if(value == 1){
        this[key].chart.yAxisMinValue = key == 'heatBalanceDataSource' ? -15 : 0;
        this[key].chart.yAxisMaxValue = key == 'heatBalanceDataSource' ? 15 : 2;
        let { data = [] } = this[key].dataset[0];
        data  = reduceDataChart(data, this[key].chart.yAxisMinValue, this[key].chart.yAxisMaxValue, 'value');
        this[key].dataset = [{data}]
        
      }else{
        let { dataset = [] } = this[key];
        if(dataset.length > 0){
          dataset = dataset[0].data;
          let { max, min } = getChartMinMax(dataset, 'value');
          if(min) min = min.toFixed(1);
          if(max) max = max.toFixed(1);
          this[key].chart.yAxisMinValue = min || 0;
          this[key].chart.yAxisMaxValue = max || 10;
          this[key].dataset = this[key].datasetTemp;
        }
      }
    }
  }

}
