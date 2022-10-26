import ChartGroupType from 'src/enums/ChartGroupType';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { DateRange } from '../../widgets/date-range-picker/public-api';
import { DateServiceService } from '../../services/date-service.service';
import { InitialService } from '../../services/initial.service';
import { Interval } from '../../../enums/intervals';
import { GroupBy } from '../../../enums/group-by';
import { DataMode } from '../../../enums/DataMode';
import { ServiceType } from '../../../enums/ServiceType';
import { HtCategory } from '../../../enums/HtCategory';
import {chartTitle, fixDecimalNumPrecision, moneyFormat} from '../../../util/ChartHelper';
import { HTApiType } from '../../../enums/HTApiType';
import find from 'lodash/find';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { DECIMAL_MAP } from 'src/enums/chart-config-map';
import { DevicerNumber } from 'src/enums/chart-color-map';

@Injectable({
  providedIn: 'root'
})

export class HtDashboardService {

  today: Date;

  serviceTypeId: number;

  todayDateRange: DateRange;

  private decimalNumPrecision = this.configs.siteConfigurations.decimalNumPrecision;


  constructor(
    private dataService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private thousandSeparator: ThousandSeparatorPipe
  ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }

    this.todayDateRange = this.dateService.getToday(this.today);
    this.dataService.serviceTypeId.subscribe(data => {
      this.serviceTypeId = data;
    });
  }

  async getHTOveralConsumptionData(startDate, endDate, dashboardType, locationId, serviceTypeId = ServiceType.HT_ELECTRICAL) {

    let overollConsumptionData;
    let response = null;
    try {
      response = await this.dataService.get(this.configs.endPoints[`ht-${dashboardType}-consumption-data-mode`], {
        location: locationId,
        startDate,
        endDate,
        serviceTypeId: serviceTypeId,
        interval: Interval.Daily,
        dataMode: DataMode.OverallSum,
        groupId: GroupBy.None,
        categoryId: HtCategory.NONE
      }).toPromise();
    } catch (e) { }

    if (response == null || !response.length || response.length === 0) {
      overollConsumptionData = this.generateOverallConsumption();
    } else {
      overollConsumptionData = response;
    }

    return overollConsumptionData;
  }

  generateOverallConsumption() {
    return [{ name: 'Nanyang Technological University', data: [{ label: '', value: null }] }];
  }

  async getHTTrendDaylyData(startDate, endDate, dashboardType, locationId, serviceTypeId = ServiceType.HT_ELECTRICAL) {

    let dailyConsumptionData;
    let response = null;
    try {
      response = await this.dataService.get(this.configs.endPoints[`ht-${dashboardType}-trend-log`], {
        startDate,
        endDate,
        interval: Interval.ThirtyMin,
        serviceTypeId: serviceTypeId,
        location: locationId
      }).toPromise();
    } catch (e) {
      dailyConsumptionData = this.plotHTTrendDaylyData(this.generateHTTrendDaylyData(), serviceTypeId);
     }

    if (response == null || !response.length || response.length === 0) {
      dailyConsumptionData = this.plotHTTrendDaylyData(this.generateHTTrendDaylyData(), serviceTypeId);
    } else {
      dailyConsumptionData = this.plotHTTrendDaylyData(response, serviceTypeId);
    }
    return dailyConsumptionData;
  }

  plotHTTrendDaylyData(data, serviceType) {
    let dailyConsumptionData;
    const chart = { ...this.configs.chartConfigurations['elec-trend-log'] };
    chart.xAxisName = '';
    chart.yAxisName = 'Energy Consumption (kWh)';
    chart.exportFileName = 'Today\'s Consumption';
    chart.total = 0;
    for (let i = 0; i < data[0].data.length; i++) {
      const item = data[0].data[i];
      chart.total += item.value;
      item.value = fixDecimalNumPrecision(item.value, this.configs.siteConfigurations.decimalNumPrecision);
      item['toolText'] = `Time: $label<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(item.value, this.configs.siteConfigurations.decimalNumPrecision))} kWh`;
      if(ServiceType.ELECTRICAL == serviceType || ServiceType.MAIN_HT_ELECTRICAL == serviceType){
        const newValue = item.value / DevicerNumber.electrical;
        data[0].data[i] = {
          ...item,
          value: item.value ? newValue: null,
          displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.electricalTodayConsumption)) : null,
          toolText: "Time: $label <br/> Consumption: $displayValue kWh",
        }
      }
    }
    // data[0].data.forEach(item => {
    //   chart.total += item.value;
    //   item.value = fixDecimalNumPrecision(item.value, this.configs.siteConfigurations.decimalNumPrecision);
    //   item['toolText'] = `Time: $label<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(item.value, this.configs.siteConfigurations.decimalNumPrecision))} kWh`;
    //   if(ServiceType.ELECTRICAL == serviceType || ServiceType.MAIN_HT_ELECTRICAL == serviceType){
    //     const newValue = item.value / DevicerNumber.electrical;
    //     console.log(newValue,'----');
        
    //     return item = {
    //       ...item,
    //       value: item.value ? newValue: null,
    //       displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.electricalTodayConsumption)) : null,
    //       toolText: "Time: $label <br/> Consumption: $displayValue kWh",
    //     }
    //   }
    // });
    dailyConsumptionData = {
      chart,
      data: data[0].data ? data[0].data : []
    };
    return dailyConsumptionData;
  }

  generateHTTrendDaylyData() {
    let time0 = new Date().setHours(0, 30, 0, 0);
    const labelAndValue = [];
    for (let i = 0; i < 48; i++) {
      labelAndValue.push({ label: this.datePipe.transform(time0, 'HH:mm') === '00:00' ? '24:00' : this.datePipe.transform(time0, 'HH:mm'), value: null });
      time0 = new Date(time0).setTime(new Date(time0).getTime() + 30 * 60 * 1000);
    }
    const data = [
      {
        name: this.configs.siteConfigurations.siteName,
        data: labelAndValue
      }
    ];
    return data;
  }

  async getSubstationDistribution(startDate, endDate, id, dashboardType, category, index, chartGroupType: ChartGroupType, serviceTypeId = ServiceType.HT_ELECTRICAL) {

    let substationDistribution = [];
    let response = null;
    let group = null;
    switch (dashboardType) {
      case HTApiType.LOOP:
        group = GroupBy.BuildingCategory;
        break;
      case HTApiType.SITE:
        group = GroupBy.HT;
        break;
    }

    response = await this.dataService.get(this.configs.endPoints[`ht-${dashboardType}-consumption-data-mode`], {
      startDate,
      endDate,
      groupId: group,
      serviceTypeId: serviceTypeId,
      interval: Interval.SecondaryThirtyMin,
      location: id,
      dataMode: DataMode.OverallSum,
      categoryId: category
    }).toPromise();

    if (response == null || response.length === 0) {
      substationDistribution = this.plotSubstationDistribution(dashboardType, [], index, chartGroupType);
    } else {
      substationDistribution = this.plotSubstationDistribution(dashboardType, response, index, chartGroupType);

    }

    return substationDistribution;
  }

  plotSubstationDistribution(dashboardType, data, index, chartGroupType: ChartGroupType) {

    let substationDistribution;
    const processedData = [];
    let totalValue = 0;
    data.forEach(element => {
      totalValue += element.data[0].value;
    });
    data.forEach((element, i) => {
      const percentage = fixDecimalNumPrecision((element.data[0].value / totalValue * 100), this.decimalNumPrecision) + ' %';
      let color = this.getColorCode(chartGroupType, element.itemId);
      element.data[0].value = element.data[0].value / DevicerNumber.electrical;
      let value = fixDecimalNumPrecision(element.data[0].value, DECIMAL_MAP.equipDistributionLg);

      let processedObject: any =  {
        displayValue: chartTitle(element.name, this.thousandSeparator.transform(value), 'kWh', percentage, index === 0),
        label: element.name,
        value,
        toolText: `Category: $label<br/>Consumption: ${this.thousandSeparator.transform(value)} kWh<br/>Percentage: ${percentage}`
      };

      if(color !== null) {
        processedObject = {...processedObject, color}
      }

      processedData.push(
        processedObject
       );

    });
    const chart = { ...this.configs.chartConfigurations['eq-distribution-lg'] };
    if (dashboardType === HTApiType.SITE) {
      chart.exportFileName = 'Loop Distribution';
    } else if (dashboardType === HTApiType.LOOP) {
      chart.exportFileName = 'Substation Distribution';
    }
    substationDistribution = {
      chart,
      data: processedData
    };
    return substationDistribution;
  }

  async getHTTrendLogs(interval, from, to, dashboardType, locationId, serviceTypeId = ServiceType.HT_ELECTRICAL) {

    let trendLogData;
    let response = null;

    try {
      response = await this.dataService.get(this.configs.endPoints[`ht-${dashboardType}-trend-log`], {
        startDate: from,
        endDate: to,
        interval: interval == Interval.Daily ? Interval.Weekly : interval,
        serviceTypeId: serviceTypeId,
        location: locationId
      }).toPromise();
    } catch (e) { }

    switch (interval) {
      case 1: {
        trendLogData = this.plotTrendLogs('Day', 'Energy Consumption(kWh)', 'Last 7 Days Consumption', response, interval, serviceTypeId);
        break;
      }
      case 2: {
        trendLogData = this.plotTrendLogs('Date', 'Energy Consumption(kWh)', 'Last 30 Days Consumption', response, interval, serviceTypeId);
        break;
      }
      case 3: {
        trendLogData = this.plotTrendLogs('Month', 'Energy Consumption(kWh)', 'Last 12 Months Consumption', response, interval, serviceTypeId);
        break;
      }
      case 4: {
        trendLogData = this.plotTrendLogs('Year', 'Energy Consumption(kWh)', 'Last 5 Years Consumption', response, interval, serviceTypeId);
        break;
      }
    }

    return trendLogData;
  }

  plotTrendLogs(xAxis, yAxis, exportFileName, response, interval, serviceType) {

    let data = [];
    // switch (interval) {
    //   case Interval.Daily:
    //     data = this.generateWeekConsumption();
    //     break;
    //   case Interval.Weekly:
    //     data = this.generateMonthConsumption();
    //     break;
    //   case Interval.Monthly:
    //     data = this.generateYearConsumption();
    //     break;
    //   case Interval.Yearly:
    //     data = this.generateFiveYearConsumption();
    //     break;
    // }

    switch(interval) {
      case Interval.Daily:
        data = this.generateConsumptionData(7, 'days', 'MMM-dd') 
        // this.generateWeekConsumption();
        break;
      case Interval.Weekly:
        data = this.generateConsumptionData(30, 'days', 'MMM-dd') 
        // data = this.generateMonthConsumption();
        break;
      case Interval.Monthly:
        data = this.generateConsumptionData(12, 'month', 'MMM-yyyy') 
        // data = this.generateYearConsumption();
        break;
      case Interval.Yearly:
        data = this.generateConsumptionData(4, 'years', 'yyyy') 
        // data = this.generateFiveYearConsumption();
        break;
    }

    const chart = { ...this.configs.chartConfigurations['elec-trend-log'] };
    chart.xAxisName = '';
    chart.yAxisName = yAxis;
    chart.exportFileName = exportFileName;

    if (response[0].data) {
      response[0].data.forEach((element, i) => {
        if (data[i]) {
          if(ServiceType.ELECTRICAL == serviceType || ServiceType.MAIN_HT_ELECTRICAL == serviceType){
            const item = data[i];
            const newValue = item.value / DevicerNumber.electrical;
            data[i] = {
              ...item,
              value: item.value ? newValue : null,
              displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.trendLogs)) : null,
              toolText: "Day: $label <br/> Consumption: $displayValue kWh",
            }
          }

          switch (interval) {
            case Interval.Daily:
              data[i].label = this.datePipe.transform(element.label, 'MMM-dd');
              data[i].tooltext = `${xAxis}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.decimalNumPrecision))} kWh`;
              chart.maxColWidth = 64;
              break;
            case Interval.Weekly:
              data[i].label = this.datePipe.transform(element.label, 'MMM-dd');
              data[i].tooltext = `${xAxis}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.decimalNumPrecision))} kWh`;
              chart.maxColWidth = 20;
              break;
            case Interval.Monthly:
              data[i].label = this.datePipe.transform(element.label, 'MMM-yyyy');
              data[i].tooltext = `${xAxis}: ${this.datePipe.transform(element.label, 'MMMM-yyyy')}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.decimalNumPrecision))} kWh`;
              chart.maxColWidth = 42;
              break;
            case Interval.Yearly:
              data[i].label = element.label;
              data[i].tooltext = `${xAxis}: ${element.label}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.decimalNumPrecision))} kWh`;
              chart.maxColWidth = 72;
              break;
            default:
              data[i].label = this.datePipe.transform(element.label, 'yyyy/MMM/dd');
              data[i].tooltext = `${xAxis}: ${this.datePipe.transform(element.label, 'yyyy/MMM/dd')}<br/>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.decimalNumPrecision))} kWh`;
              chart.maxColWidth = 64;
              break;
          }
          data[i].value = element.value;
        }
      });
    }

    return {chart, data};
  }

  async getSitehtBreakdownData(fromDate, toDate) {
    const data = [];
    const loops: any = await this.dataService.get(
      this.configs.endPoints['ht-loops'], { siteId: this.configs.siteConfigurations.siteId })
      .toPromise();

    for (const loop of loops) {
      const temp = await this.getLoopBreakdownData(loop.htLoopID, loop.htLoopName, fromDate, toDate);
      data.push(...temp);
    }
    return data;
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
        item = find(this.initialService.navigationStore.htLoops, {htLoopID: itemId});
        return this.getDefaultColorCode(item);
      case ChartGroupType.SUB_STATIONS:
        item = find(this.initialService.navigationStore.subStations, {subStationID: itemId});
        return this.getDefaultColorCode(item);
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

  async getLoopBreakdownData(loopId = null, loopName = null, fromDate, toDate) {
    // @ts-ignore
    const substations = await this.dataService.get(this.configs.endPoints['loop-substations'], {
      loopId
    }).toPromise();

    const allMetersWithSubstation = [];

    for (const substation of substations) {
      const meters = await this.dataService.get(this.configs.endPoints['substation-meters'], {
        substationId: substation.subStationID
      }).toPromise();
      allMetersWithSubstation.push({substation, meters});
    }

    const dataSet = [];

    for (const mainRow of allMetersWithSubstation) {
      for (const meter of mainRow.meters) {
        dataSet.push({
          loopName,
          substationName: mainRow.substation.subStationName,
          meterName: meter.meterName,
          opcTag: meter.opcTag,
        });
      }
    }

    return dataSet;
  }

  private generateConsumptionData = (totalDay: number = 7, keyDate: string = 'days', dateFormat: string = 'MM-dd') => {
    let data = [];
    if(keyDate == 'years'){
      for (let i = totalDay; i >= 0; i--) {
        data.push({
          label: this.datePipe.transform(this.getDemoDate().setFullYear(this.getDemoDate().getFullYear() - i), 'yyyy'),
          value: null,
          tooltext: ''
        });
      }
    }else{
      let lastdayList = this.dateService.getLastDays(this.today, totalDay, keyDate);
      for (let i = 0; i < totalDay; i++) {
        data.push(
          {
            label: this.datePipe.transform(lastdayList[i], dateFormat),
            value: null,
            tooltext: ''
          }
        );
      }
    }
    return data;
  }

  // private generateWeekConsumption() {
  //   let daysLastSeven = this.dateService.getLastDays(this.today, 7, 'days');
  //   let data = [];
  //   for (let i = 0; i < 7; i++) {
  //     data.push(
  //       {
  //         label: this.datePipe.transform(daysLastSeven[i], 'MMM-dd'),
  //         value: null,
  //         tooltext: ''
  //       }
  //     );
  //   }
  //   return data;
  // }

  // private generateMonthConsumption() {
  //   let lastThirtyDays = this.dateService.getLastDays(this.today, 30, 'days');
  //   let data = [];
  //   for (let num = 0; num < 30; num++) {
  //     data.push ({
  //       label: this.datePipe.transform(lastThirtyDays[num], 'MMM-dd'),
  //       value: null,
  //       tooltext: ''
  //     });
  //   }

  //   return data;
  // }

  // private generateYearConsumption() {
  //   let data = [];
  //   let months = this.dateService.getLastDays(this.today, 12, 'month');
  //   for (let i = 0; i < 12; i++) {
  //     data.push({
  //       label: this.datePipe.transform(months[i], 'MMM-yyyy'),
  //       value:  null,
  //       tooltext: ''
  //     });
  //   }

  //   return data;
  // }

  // private generateFiveYearConsumption() {
  //   let data = [];
  //   for (let i = 4; i >= 0; i--) {
  //     data.push({
  //       label: this.datePipe.transform(this.getDemoDate().setFullYear(this.getDemoDate().getFullYear() - i), 'yyyy'),
  //       value: null,
  //       tooltext: ''
  //     });
  //   }
  //   return data;
  // }

  private getDemoDate() {
    if (this.configs.config.demo) {
      return new Date(this.configs.config.demoDate);
    } else {
      return  new Date();
    }
  }
}
