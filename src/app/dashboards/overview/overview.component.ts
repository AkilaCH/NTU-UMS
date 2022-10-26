import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { HttpService } from 'src/app/services/http.service';
import { DatePipe } from '@angular/common';
import { DateServiceService } from 'src/app/services/date-service.service';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import { InitialService } from 'src/app/services/initial.service';
import { ServiceType } from '../../../enums/ServiceType';
import { Interval } from '../../../enums/intervals';
import { GroupBy } from '../../../enums/group-by';
import { DataMode } from '../../../enums/DataMode';
import find from 'lodash/find';
import { abbreviateNumber, fixDecimalNumPrecision, moneyFormat, roundConsumptionValue } from '../../../util/ChartHelper';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { ChartColorMap, ChartColorMapType, DevicerNumber } from 'src/enums/chart-color-map'
//import { DECIMAL_MAP } from 'src/enums/chart-config-map';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {
  elecChangeInConsumption: any = {};
  elecOldValue: number;
  elecNewValue: number;
  waterChangeInConsumption: any = {};
  coolingChangeInConsumption: any = {};
  consumptionSummary: any = {};
  waterOldValue: number;
  waterNewValue: number;
  coolingOldValue: number;
  coolingNewValue: number;
  // TODO: replaced stack chart with column3d chart
  // elecCategoryOverview: any = {};
  realTimeConsumptionElec: any;
  thisYearConsumptionElec: any;
  thisYearConsumptionWater: any;
  thisYearConsumptionCooling: any;
  thisYearConsumptionFootPrint: any;
  decimalNumPrecision: number;
  realTimeConsumptionElecUnit: string;
  realTimeConsumptionWaterUnit: string;
  realTimeConsumptionWater: any;
  realTimeConsumptionCoolingLoad: any;
  realTimeConsumptionCoolingLoadUnit: string;
  today: Date;
  lastTwoMonthRange: DateRange;
  lastSixMonthRange: DateRange;
  thisMonthConsumption: DateRange;
  thisYearConsumption: DateRange;
  siteId: number;
  serviceTypeChangeSummary = false;
  suffix: any = {'elec': '', 'water': '', 'cooling': ''};
  colorMap: ChartColorMapType = ChartColorMap;
  isDone: any = {
    
  }
  

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private dateHelper: DateServiceService,
    private initialService: InitialService,
    private thousandSeparator: ThousandSeparatorPipe
  ) {
    this.headerService.setBoardLevel(2);

    this.dataService
    .get(this.configs.endPoints.site, { siteId: this.configs.siteConfigurations.siteId})
    .subscribe(
      data => {
        this.headerService.setItem(data.siteName);
      },
      error => {
        this.headerService.setItem('Site Name');
      }
    );

    if (!this.initialService.getDemoConfig().isDemo) {
      this.today = new Date();
    } else {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    }

    this.lastTwoMonthRange = this.dateHelper.getTwoMonth(this.today);

    this.lastSixMonthRange = this.dateHelper.getLastSixMonth(this.today);

    this.thisMonthConsumption = this.dateHelper.thisMonthUpToNow(this.today);
    this.thisYearConsumption = this.dateHelper.getThisYear(this.today);

    this.dataService.siteId.subscribe(data => {
      this.siteId = data;
    });

    this.decimalNumPrecision = this.configs.siteConfigurations.realTimeConsumptiondecimalNumPrecision;
  }

  ngOnInit() {
    // TODO: replaced stack chart with column3d chart

    
    this.getMonthlyYearlyConsumption();
    this.getWaterChangeInConsumption();
    this.getElecChangeInConsumption();
    // this.getMainIncomerConsumption();
    this.getCoolingChangeInConsumption();

    this.getElectricalCoolingConsumptionSummary().then(res=>{
      this.consumptionSummary = res;
      this.isDone.consumptionSummary = true;
    });

    setInterval(() => {
      this.getMonthlyYearlyConsumption();
    }, 1000 * 60 * 30);

  }

  generateChangeInConsumption() {
    let dateRange = this.dateHelper.getDateRangeDateList(this.lastTwoMonthRange, "months")
    const labelAndValue = [];
    for (let i = 1; i >= 0; i--) {
      labelAndValue.push({
        label: dateRange[i],
        value: null
      });
    }
    const data = [{ data: labelAndValue }];
    return data;
  }

  serviceTypeToggleSummary(event){
    if(event){
      this.serviceTypeChangeSummary = true;
    } else {
      this.serviceTypeChangeSummary = false;
    }
  }

  plotChnageInConsumption(data, mode) {
    let unit;
    switch(mode) {
      case ServiceType.MAIN_INCOMER:
        unit = 'kWh';
        break;
      case ServiceType.WATER:
        unit = 'm<sup>3</sup>';
        break;
      case ServiceType.MAIN_WATER:
        unit = 'm<sup>3</sup>';
        break;
      case ServiceType.CHILLER:
        unit = 'RTh';
        break;
    }

    const newData: Array<any> = [];
    for (let i = 0; i < data.length; i++) {
      const childData = data[i].data;
      for (let j = 0; j < childData.length; j++) {
        let newValue = childData[j].value;
        const { scalledNumber, suffix, unit } = abbreviateNumber(Number(newValue), mode);
        let displayValue = childData[j].value ? `${scalledNumber}${suffix}` : null
        if(mode == ServiceType.MAIN_INCOMER && newValue){
          newValue = (newValue / DevicerNumber.electrical).toFixed(0);
          displayValue = moneyFormat(newValue);
        }
        const dateVale = this.datePipe.transform(childData[j].label, "yyyy-MMMM");
        const newItem: any = {
          label: this.datePipe.transform(childData[j].label, "MMM"),
          value: newValue,
          displayValue: displayValue,
          dateVale: this.datePipe.transform(childData[j].label, "yyyy-MMMM"),
          tooltext: `Month: ${dateVale} <br/>Consumption: $displayValue ${unit}`
        }
        newData.push(newItem)
          
      }
    }

    // let newData = [
    //   {
    //     label: this.datePipe.transform(data[0].data[0].label, "MMM"),
    //     value: data[0].data[0].value,
    //     tooltext: `Month: ${this.datePipe.transform(data[0].data[0].label, "yyyy-MMMM")}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[0].data[0].value, this.configs.siteConfigurations.decimalNumPrecision))} ${unit}`
    //   },
    //   {
    //     label: this.datePipe.transform(data[0].data[1].label, "MMM"),
    //     value: data[0].data[1].value,
    //     tooltext: `Month: ${this.datePipe.transform(data[0].data[1].label, "yyyy-MMMM")}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[0].data[1].value, this.configs.siteConfigurations.decimalNumPrecision))} ${unit}`
    //   }
    // ];
    // console.log(mode, '=> ',newData);
    

    switch(mode) {
      case ServiceType.MAIN_INCOMER:
        this.elecChangeInConsumption.data = newData;
        this.elecChangeInConsumption.chart = this.configs.chartConfigurations[
          'site-consumption-mode'
        ];
        this.elecOldValue = data[0].data[0].value;
        this.elecNewValue = data[0].data[1].value;
        this.elecChangeInConsumption.chart['paletteColors'] = [ChartColorMap.electric.primary, ChartColorMap.electric.secondary];
        break;
      case ServiceType.WATER:
        this.waterChangeInConsumption.data = newData;
        this.waterChangeInConsumption.chart = this.configs.chartConfigurations[
          'water-change-in-consumption'
        ];
        this.waterOldValue = data[0].data[0].value;
        this.waterNewValue = data[0].data[1].value;
        this.waterChangeInConsumption.chart['paletteColors'] = [ChartColorMap.water.primary, ChartColorMap.water.secondary]
        break;
      case ServiceType.MAIN_WATER:
        this.waterChangeInConsumption.data = newData;
        this.waterChangeInConsumption.chart = this.configs.chartConfigurations[
          'water-change-in-consumption'
        ];
        this.waterOldValue = data[0].data[0].value;
        this.waterNewValue = data[0].data[1].value;
        this.waterChangeInConsumption.chart['paletteColors'] = [ChartColorMap.water.primary, ChartColorMap.water.secondary]
        break;
      case ServiceType.CHILLER:
        this.coolingChangeInConsumption.data = newData;
        this.coolingChangeInConsumption.chart = this.configs.chartConfigurations[
          'cooling-change-in-consumption'
        ];
        this.coolingOldValue = data[0].data[0].value;
        this.coolingNewValue = data[0].data[1].value;
        this.coolingChangeInConsumption.chart['paletteColors'] = [ChartColorMap.cooling.primary, ChartColorMap.cooling.secondary]
        break;
    }

  }

  getElecChangeInConsumption() {
    this.plotChnageInConsumption(this.generateChangeInConsumption(), ServiceType.MAIN_INCOMER);
    this.getChangeInConsumptionData(ServiceType.MAIN_INCOMER)
      .then(
        data => {
          this.isDone.elecChangeInConsumption = true
          if (data == null || data.length == 0) {
            this.plotChnageInConsumption(
              this.generateChangeInConsumption(),
              ServiceType.MAIN_INCOMER
            );
          } else {
            this.plotChnageInConsumption(data, ServiceType.MAIN_INCOMER);
          }
        },
        err => {
          this.plotChnageInConsumption(
            this.generateChangeInConsumption(),
            ServiceType.MAIN_INCOMER
          );
        }
      );
  }

  getWaterChangeInConsumption() {
    this.isDone.waterChangeInConsumption = false;
    this.plotChnageInConsumption(this.generateChangeInConsumption(), ServiceType.WATER);
    this.getChangeInConsumptionData(ServiceType.MAIN_WATER)
      .then(
        data => {
          this.isDone.waterChangeInConsumption = true;
          if (data == null || data.length == 0) {
            this.plotChnageInConsumption(
              this.generateChangeInConsumption(),
              ServiceType.WATER
            );
          } else {
            this.plotChnageInConsumption(data, ServiceType.WATER);
          }
        },
        err => {
          this.plotChnageInConsumption(
            this.generateChangeInConsumption(),
            ServiceType.WATER
          );
        }
      );
  }

  getCoolingChangeInConsumption() {
    this.isDone.coolingChangeInConsumption = false;
    this.plotChnageInConsumption(this.generateChangeInConsumption(), ServiceType.CHILLER);
    this.getChangeInConsumptionData(ServiceType.CHILLER)
      .then(
        data => {
          this.isDone.coolingChangeInConsumption = true;
          if (data == null || data.length == 0) {
            this.plotChnageInConsumption(
              this.generateChangeInConsumption(),
              ServiceType.CHILLER
            );
          } else {
            this.plotChnageInConsumption(data, ServiceType.CHILLER);
          }
        },
        err => {
          this.plotChnageInConsumption(
            this.generateChangeInConsumption(),
            ServiceType.CHILLER
          );
        }
      );
  }

  async getChangeInConsumptionData(serviceType) {
    try {
      let data = await this.dataService
      .get(this.configs.endPoints['site-consumption-mode'], {
        siteId: this.configs.siteConfigurations.siteId,
        startDate: this.datePipe.transform(
          this.lastTwoMonthRange.start,
          'yyyy/MM/dd'
        ),
        endDate: this.datePipe.transform(
          this.lastTwoMonthRange.end,
          'yyyy/MM/dd'
        ),
        groupId: GroupBy.None,
        serviceTypeId: serviceType,
        interval: Interval.Monthly
      }).toPromise();
      return data;
    } catch(e) {
      return "error";
    }

  }

  async getConsumptionSummaryChartData(serviceType:ServiceType) {
    // this.plotMainIncomerConsumptionChart(this.generateMainIncomerConsumptionData());
    let data = await this.dataService.get(this.configs.endPoints['site-consumption-mode'], {
      siteId: this.configs.siteConfigurations.siteId,
      startDate: this.datePipe.transform(
        this.lastSixMonthRange.start,
        'yyyy/MM/dd'
      ),
      endDate: this.datePipe.transform(
        this.lastSixMonthRange.end,
        'yyyy/MM/dd'
      ),
      groupId: GroupBy.None,
      serviceTypeId: serviceType,
      interval: Interval.Monthly
    }).toPromise();

    return data;

  }

  generateMainIncomerConsumptionData() {
    const labelAndValue = [];
    for (let i = 6; i >= 1; i--) {
      labelAndValue.push({
        label: this.datePipe.transform(
          new Date().setMonth(new Date().getMonth() - i),
          'MMMM'
        ),
        value: null
      });
    }
    return labelAndValue;
  }

  async fetchMonthlyYearlyConsumption(dateRang: DateRange, serviceType: ServiceType, interval: any = undefined) {
    try {
      let res = await this.dataService.get(this.configs.endPoints['site-consumption-data-mode'], {
        siteId: this.configs.siteConfigurations.siteId,
        startDate: this.datePipe.transform(dateRang.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(dateRang.end, 'yyyy/MM/dd'),
        groupId: GroupBy.None,
        serviceTypeId: serviceType,
        interval: interval!== undefined ? interval : Interval.Daily,
        dataMode: 1
      }).toPromise();
      return res != null ? res : [];
    } catch (error) {
      return [];
    }
  }

  initialValueNA (keyArr : Array<string> = ['realTimeConsumptionElec']){
    for (let i = 0; i < keyArr.length; i++) {
      const key = keyArr[i];
      if(this[key] === null || this[key] === undefined ){
        this[key] = 'N/A'
      }
    }
  }

  getMonthlyYearlyConsumption() {

    // Fetch Data For This Month Consumption charts
    this.initialValueNA(['realTimeConsumptionElec','realTimeConsumptionCoolingLoad','realTimeConsumptionWater'])
    this.isDone.realTimeConsumptionElec = false;
    this.isDone.realTimeConsumptionCoolingLoad = false;
    this.isDone.realTimeConsumptionWater = false;
    this.isDone.thisYearConsumptionElec = false;
    this.isDone.thisYearConsumptionWater = false;
    this.isDone.thisYearConsumptionCooling = false;
    this.isDone.thisYearConsumptionFootPrint = false;
    this.fetchMonthlyYearlyConsumption(this.thisMonthConsumption, ServiceType.MAIN_INCOMER).then(res => {
      const { scalledNumber, suffix, unit } = abbreviateNumber(Number(res[0].data[0].value), ServiceType.MAIN_INCOMER);
      // this.realTimeConsumptionElec = fixDecimalNumPrecision(scalledNumber, 3);
      this.realTimeConsumptionElec = moneyFormat((res[0].data[0].value / DevicerNumber.electrical).toFixed());
      this.realTimeConsumptionElecUnit = unit;
      this.suffix['elec'] = '';
      this.isDone.realTimeConsumptionElec = true;
      // this.realTimeConsumptionElec = roundConsumptionValue(res[0].data[0].value, ServiceType.MAIN_INCOMER).value;
      // this.realTimeConsumptionElecUnit = roundConsumptionValue(res[0].data[0].value, ServiceType.MAIN_INCOMER).unit;
    });

    this.fetchMonthlyYearlyConsumption(this.thisMonthConsumption, ServiceType.CHILLER, Interval.ThirtyMin).then(res => {
      const { scalledNumber, suffix, unit } = abbreviateNumber(Number(res[0].data[0].value), ServiceType.CHILLER);
      this.realTimeConsumptionCoolingLoad = fixDecimalNumPrecision(scalledNumber, 3);;
      this.realTimeConsumptionCoolingLoadUnit = unit;
      this.suffix['cooling'] = suffix;
      this.isDone.realTimeConsumptionCoolingLoad = true;
      // this.realTimeConsumptionCoolingLoad = roundConsumptionValue(res[0].data[0].value, ServiceType.CHILLER).value;
      // this.realTimeConsumptionCoolingLoadUnit = roundConsumptionValue(res[0].data[0].value, ServiceType.CHILLER).unit;
    });

    this.fetchMonthlyYearlyConsumption(this.thisMonthConsumption, ServiceType.MAIN_WATER).then(res => {
      const { scalledNumber, suffix, unit } = abbreviateNumber(Number(res[0].data[0].value), ServiceType.MAIN_WATER);
      this.realTimeConsumptionWater = fixDecimalNumPrecision(scalledNumber, 3);
      this.realTimeConsumptionWaterUnit = unit;
      this.suffix['water'] = suffix;
      this.isDone.realTimeConsumptionWater = true;
      // this.realTimeConsumptionWater = roundConsumptionValue(res[0].data[0].value, ServiceType.WATER).value, 2;
      // this.realTimeConsumptionWaterUnit = roundConsumptionValue(res[0].data[0].value, ServiceType.WATER).unit;
    });


    // Fetch data for this year consumption charts
    this.fetchMonthlyYearlyConsumption(this.thisYearConsumption, ServiceType.MAIN_INCOMER).then(res => {
      this.thisYearConsumptionElec = res[0].data[0].value;
      this.isDone.thisYearConsumptionElec = true;
    });
    
    this.fetchMonthlyYearlyConsumption(this.thisYearConsumption, ServiceType.MAIN_WATER).then(res => {
      this.thisYearConsumptionWater = res[0].data[0].value;
      this.isDone.thisYearConsumptionWater = true;
    });

    this.fetchMonthlyYearlyConsumption(this.thisYearConsumption, ServiceType.CHILLER, Interval.ThirtyMin).then(res => {
      this.thisYearConsumptionCooling = res[0].data[0].value;
      this.isDone.thisYearConsumptionCooling = true;
    });

    this.fetchMonthlyYearlyConsumption(this.thisYearConsumption, ServiceType.MAIN_INCOMER).then(res => {
      this.thisYearConsumptionFootPrint = res[0].data[0].value * .408;
      this.isDone.thisYearConsumptionFootPrint = true;
    });
  }


  // TODO: replaced stack chart with column3d chart

  plotEnergyConsumption(data) {
    const newData = [];
    data.forEach(element => {
      const labelAndValue = [];
      element.data.forEach(i => {
        labelAndValue.push({ label: i.label, value: i.value });
      });
      newData.push({
        name: element.name,
        data: labelAndValue,
        itemId: element.itemId
      });
    });

    let chart = this.configs.chartConfigurations['site-elec-cat-overview'];
    chart.exportFileName = 'Water Summary - Last 6 Months';
    const category = [];
    const dataSets = [];
    const total = [];

    if (newData !== null) {
      newData[0].data.forEach(element => {
        total.push({ value: null, tooltext: '' });
      });
    }
    newData.forEach((element, i) => {
      const data = [];
      element.data.forEach((month, key) => {
        if (i === 0) {
            category.push({
            label: this.datePipe.transform(month.label, 'yyyy-MMM')
          });
        }
        data.push({
          value: month.value,
          tooltext: `Category: ${element.name}<br/>Month: ${this.datePipe.transform(month.label, 'yyyy-MMMM')}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(month.value, this.configs.siteConfigurations.decimalNumPrecision))} m³`
        });
        if (month.value !== null) {
          if (total[key].value === null) {
            total[key].value = 0;
          }
          total[key].value = total[key].value + month.value;
          total[key].tooltext = `Category: $seriesname<br/>Month: ${this.datePipe.transform(month.label, 'yyyy-MMMM')}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(total[key].value, this.configs.siteConfigurations.decimalNumPrecision))} m³`;
        }
      });

      dataSets.push({
        seriesname: element.name,
        data,
        color: this.getEnergyConsumptionChartColor(element.itemId)
      });
    });

    dataSets.push({
      seriesname: "Total Consumption",
      renderas: "Line",
      data: total,
      showValues: '1'
    });

    return {
      chart,
      categories: [{ category }],
      dataset: dataSets
    };
  }

  private getEnergyConsumptionChartColor(itemId: number) {
    if (itemId !== undefined && itemId !== null) {
      let item: any = find(this.initialService.navigationStore.buildingCategories, {buildingCategoryID: itemId});
      let color = find(item.attributes, {textId: this.configs.config.attributes.COLOR_CODE});
      return color === null || color === undefined ? this.configs.config.defaultColorCode : color.value;
    } else {
      return this.configs.config.defaultColorCode;
    }
  }

  generateEnergyConsumption() {
    const labelAndValue = [];
    const months = this.dateHelper.getDateRangeDateList(this.lastSixMonthRange, "months")
    for (let i = 5; i >6; i--) {
      labelAndValue.push({
        label: months[i],
        value: null
      });
    }
    const data = [
      {
        name: null,
        itemId: 1,
        data: labelAndValue
      }
    ];
    return data;
  }

  onSixMonthChartToggle(event) {
    // this.consumptionSummary = null
    this.consumptionSummary.dataset = [] ;
    this.isDone.consumptionSummary =false
    if(event) {
      this.serviceTypeChangeSummary = true;
      this.getWaterConsumptionSummary().then(res=>{
        this.consumptionSummary = res;
        this.isDone.consumptionSummary = true;
      });
    } else {
      this.serviceTypeChangeSummary = false;
      this.getElectricalCoolingConsumptionSummary().then(res=>{
        this.consumptionSummary = res;
        this.isDone.consumptionSummary = true;
      });
    }
  }

  async getElectricalCoolingConsumptionSummary() {

    let electricalData = await this.getConsumptionSummaryChartData(ServiceType.MAIN_INCOMER);
    let coolingLoad = await this.getConsumptionSummaryChartData(ServiceType.CHILLER);

    this.plotElectricalCoolingConsumptionSummary(this.lastSixMonthRange);

    let preparedData = this.plotElectricalCoolingConsumptionSummary(this.lastSixMonthRange);
    preparedData.dataset[0].data = [];
    preparedData.dataset[1].data = [];
    electricalData[0].data.forEach(item=>{
      preparedData.dataset[0].data.push({
        value: item.value / DevicerNumber.electrical,
        toolText: `Category: $seriesName <br>Month: ${this.datePipe.transform(item.label, 'yyyy-MMMM')}<br>Value: ${this.thousandSeparator.transform(fixDecimalNumPrecision((item.value), this.configs.siteConfigurations.decimalNumPrecision))} kWh`, 
        color: ChartColorMap.electric.secondary,
        displayValue: moneyFormat((item.value / DevicerNumber.electrical).toFixed())
      });
    });

    coolingLoad[0].data.forEach(item=>{
      const { scalledNumber, suffix, unit } = abbreviateNumber(Number(item.value), ServiceType.MAIN_INCOMER);
      preparedData.dataset[1].data.push({
        value: item.value / DevicerNumber.electrical, 
        toolText: `Category: $seriesName <br>Month: ${this.datePipe.transform(item.label, 'yyyy-MMMM')}<br>Value: ${this.thousandSeparator.transform(fixDecimalNumPrecision((item.value), this.configs.siteConfigurations.decimalNumPrecision))} RTh`,
        color: ChartColorMap.cooling.secondary,
        displayValue: `${scalledNumber}${suffix}`
      });
    });
    preparedData.chart = {
      ...preparedData.chart,
      showValues:  1, placeValuesInside:  1,rotateValues: 1,
    }
    return preparedData;
    // TODO: Prepare chart for the consumption summary chart
  }

  plotElectricalCoolingConsumptionSummary(dateRange:DateRange) {
    let data = {
      chart: {},
      categories: [
        {
          category: []
        }
      ],
      dataset: [
        {
          seriesname: 'Electrical Energy (kWh)',
          data: [],
          formatNumberScale: 0,
          color: ChartColorMap.electric.primary,
          renderAs: "column",
        },
        {
          seriesname: 'Cooling Load (RTh)',
          data: [],
          color: ChartColorMap.cooling.primary,
          
        }
      ]
    };
    data.chart = this.configs.chartConfigurations.energyConsumptionSummaryCoolingElectrical;
    data.chart = {
      ...data.chart,
      formatNumberScale: 0,
    }
    data.chart['exportFileName'] = 'Electrical Energy and Cooling Load Summary - Last 6 Months';
    let months =  this.dateHelper.getDateRangeDateList(dateRange, 'month');
    for(let i = 0; i<6; i++) {
      data.categories[0].category.push(
        {
          label: this.datePipe.transform(months[i], "yyyy-MMM")
        }
      );
    }
    return data;
  }

  async getWaterConsumptionSummary() {
    this.plotEnergyConsumption(this.generateEnergyConsumption());
    let data = await this.dataService
      .get(this.configs.endPoints['site-consumption-data-mode'], {
        siteId: this.configs.siteConfigurations.siteId,
        startDate: this.datePipe.transform(
          this.lastSixMonthRange.start,
          'yyyy/MM/dd'
        ),
        endDate: this.datePipe.transform(
          this.lastSixMonthRange.end,
          'yyyy/MM/dd'
        ),
        groupId: GroupBy.BuildingCategory,
        serviceTypeId: ServiceType.WATER,
        interval: Interval.Monthly,
        dataMode: DataMode.CategorySum
      }).toPromise();

    data = this.plotEnergyConsumption(data);

    return data;
  }

}
