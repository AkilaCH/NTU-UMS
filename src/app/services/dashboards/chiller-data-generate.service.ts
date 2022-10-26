import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateRange } from '../../widgets/date-range-picker/public-api';
import { fixDecimalNumPrecision } from 'src/util/ChartHelper';
import { InitialService } from '../initial.service';

@Injectable({
  providedIn: 'root'
})
export class ChillerDataGenerateService {

  datePipe = new DatePipe('en-US');

  dataSource: any = {};

  constructor(private config: InitialService) { }

  plotHeatBalanceChart(data, dateRange?: DateRange) {

    let dateTime = '';
    let heatBalance = '';

    if (data.length === 0 && dateRange) {
      dateTime = this.chillerEfficiencyEmptyData(dateRange).dateTime;
      heatBalance = this.chillerEfficiencyEmptyData(dateRange).data;
    } else {
      data.forEach(element => {
        dateTime += element.dateTime + ',';
        heatBalance += (element.heat_balance ? fixDecimalNumPrecision(element.heat_balance, this.config.siteConfigurations.decimalNumPrecision) : 'null') + ',';
      });
    }

    dateTime = dateTime.substring(0, dateTime.length - 1);
    heatBalance = heatBalance.substring(0, heatBalance.length - 1);

    let returnData = this.config.chartConfigurations.heatBalance;
    returnData.categories[0].category = dateTime;
    returnData.dataset[0].data = heatBalance;

    return returnData;
  }

  heatBalanceEmptyData(dateRange: DateRange) {
    let start = dateRange.start;
    start.setHours(0);
    start.setMinutes(0);
    let data = [];
    for (let index = 1; index < 1145; index++) {
      start.setTime(start.getTime() + 1000 * 60);
      data.push({
        lable: this.datePipe.transform(start, 'yyyy/MM/dd HH:mm'),
        value: null
      });
    }
    return data;
  }

  generateChillerEfficiencyChart(data, dateRange?: DateRange) {
    let dateTime = '';
    let efficiency = '';

    if (data.length === 0 && dateRange) {
      dateTime = this.chillerEfficiencyEmptyData(dateRange).dateTime;
      efficiency = this.chillerEfficiencyEmptyData(dateRange).data;
    } else {
      data.forEach(element => {
        dateTime += element.dateTime + ',';
        efficiency += fixDecimalNumPrecision(element.efficiency, this.config.siteConfigurations.decimalNumPrecision) + ',';
      });
    }

    dateTime = dateTime.substring(0, dateTime.length - 1);
    efficiency = efficiency.substring(0, efficiency.length - 1);

    let returnData = this.config.chartConfigurations.chillerEfficiency;
    returnData.categories[0].category = dateTime;
    returnData.dataset[0].data = efficiency;
    returnData.trendlines[0].line[0].startvalue = this.config.siteConfigurations.chillerEfficiencyBaseLineValue;

    return returnData;
  }

  generateCarbonFootprintChart(data, dateRange?: DateRange) {
    let category = '';
    let data0 = '';
    let data1 = '';
    let data2 = '';

    if (data.length === 0 && dateRange) {
      category = this.carbonFootprintEmptyData(dateRange).dateTime;
      data0 = data1 = data2 = this.carbonFootprintEmptyData(dateRange).data;
    } else {
      data.forEach(element => {
        category += element.dateTime + '|';
        data0 += fixDecimalNumPrecision(element.daily_energy, this.config.siteConfigurations.decimalNumPrecision) + '|';
        data1 += fixDecimalNumPrecision(element.co2_daily_emission, this.config.siteConfigurations.decimalNumPrecision) + '|';
        data2 += fixDecimalNumPrecision(element.co2_monthly_emission, this.config.siteConfigurations.decimalNumPrecision) + '|';
      });
    }

    category = category.substring(0, category.length - 1);
    data0 = data0.substring(0, data0.length - 1);
    data1 = data1.substring(0, data1.length - 1);
    data2 = data2.substring(0, data2.length - 1);

    let returnData = this.config.chartConfigurations.carbonFootprint;
    returnData.categories[0].category = category;
    returnData.dataset[0].data = data0;
    returnData.dataset[1].data = data1;
    // returnData.dataset[2].data = data2;

    return returnData;
  }

  generateCondenserPerformanceChart(data) {
    let data0 = [];
    let data1 = [];

    if (data.length === 0) {
      data0 = data1 = this.condenserPerformanceEmptyChartData();
    } else {
      data.forEach((element, i) => {
        if (element.cdw_supply_temp != null && element.dry_bulb != null) {
          data0.push(
            {
              y: fixDecimalNumPrecision(element.cdw_supply_temp, this.config.siteConfigurations.decimalNumPrecision),
              x: fixDecimalNumPrecision(element.dry_bulb, this.config.siteConfigurations.decimalNumPrecision)
            });
        }
        if (element.cdw_return_temp != null && element.dry_bulb != null) {
          data1.push(
            {
              y: fixDecimalNumPrecision(element.cdw_return_temp, this.config.siteConfigurations.decimalNumPrecision),
              x: fixDecimalNumPrecision(element.dry_bulb, this.config.siteConfigurations.decimalNumPrecision)
            });
        }
      });
    }

    let returnData = this.config.chartConfigurations.condenserPerformance;
    returnData.dataset[0].data = data0;
    returnData.dataset[1].data = data1;
    return returnData;
  }

  chillerEfficiencyEmptyData(dateRange: DateRange) {
    let hours = new Date().getHours();
    let dateTime = '';
    let data = '';

    for (let hour = 0; hour <= hours; hour++) {
      let date = new Date().setHours(hour);
      for (let minute = 0; minute < 60; minute++) {
        dateTime = dateTime + this.datePipe.transform(new Date(date).setMinutes(minute), 'dd/MM/y HH:mm') + ',';
        data = data + 'null,';
      }
    }

    return {
      dateTime,
      data
    };
  }

  carbonFootprintEmptyData(dateRange: DateRange) {
    const diffDays = Math.ceil(Math.abs(dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 3600 * 24));
    let dateTime = '';
    let data = '';

    for (let index = 1; index <= diffDays; index++) {
      dateTime = dateTime + this.datePipe.transform(new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), index), 'dd-MM-y') + ',';
      data = data + 'null,';
    }

    return {
      dateTime,
      data
    };
  }

  condenserPerformanceEmptyChartData() {
    const data = [];

    for (let index = 1; index < 36; index++) {
      data.push(
        {
          x: index,
          y: null
        });
    }

    return data;
  }
}
