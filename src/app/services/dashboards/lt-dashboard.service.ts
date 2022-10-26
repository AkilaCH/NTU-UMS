import { forkJoin, Observable } from 'rxjs';
import { InitialService } from 'src/app/services/initial.service';
import { DatePipe } from '@angular/common';
import { HttpService } from './../http.service';
import { ServiceType } from './../../../enums/ServiceType';
import { Injectable } from '@angular/core';
import { Interval } from 'src/enums/intervals';
import { intervalGroup } from 'src/enums/IntervalGroup';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import { DataMode } from 'src/enums/DataMode';
import { GroupBy } from 'src/enums/group-by';
import ChartDashboardType from 'src/enums/ChartDashboardType';
import { abbreviateNumber, chartTitle, dateGapGenerator, fixDecimalNumPrecision, moneyFormat } from 'src/util/ChartHelper';
import { DistributionChartType } from 'src/enums/DustributionChartType';
import { Building } from '../../models/building';
import ChartGroupType from 'src/enums/ChartGroupType';
import find from 'lodash/find';
import { DateServiceService } from '../date-service.service';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { GfaService } from './gfa.service';
import { DECIMAL_MAP } from 'src/enums/chart-config-map';
import { DevicerNumber } from 'src/enums/chart-color-map';

@Injectable({
  providedIn: 'root'
})
export class LtDashboardService {

  private decimalNumPrecision = this.config.siteConfigurations.decimalNumPrecision;
  private months = [
      "January", "February", "March",
      "April", "May", "June",
      "July", "August", "September",
      "October", "November", "December"
  ];
  private today;

  constructor(
    private dataService: HttpService,
    private config: InitialService,
    private datePipe: DatePipe,
    private initialService: InitialService,
    private dateService: DateServiceService,
    private thousandSeparator: ThousandSeparatorPipe,
    private gfaService: GfaService
  ) {
    
    if(config.config.demo) {
      this.today = new Date(config.config.demoDate);
    } else {
      this.today = new Date();
    }
  }

  async getProfileChartBuilding(serviceType, buildingId, fromDate, toDate){

    let weekConsumptions = await this.dataService.get(this.config.endPoints["profile-chart"],
    {
      startDate: this.datePipe.transform(fromDate, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(toDate, 'yyyy/MM/dd'),
      serviceTypeId: serviceType,
      interval: Interval.ThirtyMin,
      buildingId:  buildingId,
      groupId : 4
    }
    ).toPromise();
    let holidayConsumptions = await this.dataService.get(
      this.config.endPoints["profile-chart"],
        {
          startDate: this.datePipe.transform(fromDate, 'yyyy/MM/dd'),
          endDate: this.datePipe.transform(toDate, 'yyyy/MM/dd'),
          serviceTypeId: serviceType,
          interval: Interval.ThirtyMin,
          buildingId: buildingId,
          groupId : 5
        }
    ).toPromise();

    weekConsumptions.push(holidayConsumptions[0]);
    return this.prepareProfileChart(serviceType ,[weekConsumptions]);

  }

  /*
    8-day profile chart building group
  */
  async getProfileChartBuildingGroup(serviceType, groupId, fromDate, toDate){
    let buildingsData = [];
    let buildings = await this.dataService.get(
      this.config.endPoints["site-building-group-all-buildings"],
      {
        siteId: this.config.siteConfigurations.siteId,
        groupId: groupId
      }
    ).toPromise();

    for (let building of buildings) {
      let weekConsumptions = await this.dataService.get(this.config.endPoints["profile-chart"],
      {
        startDate: this.datePipe.transform(fromDate, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(toDate, 'yyyy/MM/dd'),
        serviceTypeId: serviceType,
        interval: Interval.ThirtyMin,
        buildingId:  building.buildingID,
        groupId : 4
      }).toPromise();
      let holidayConsumptions = await this.dataService.get( this.config.endPoints["profile-chart"],
        {
          startDate: this.datePipe.transform(fromDate, 'yyyy/MM/dd'),
          endDate: this.datePipe.transform(toDate, 'yyyy/MM/dd'),
          serviceTypeId: serviceType,
          interval: Interval.ThirtyMin,
          buildingId:  building.buildingID,
          groupId : 5
        }).toPromise();
      weekConsumptions.push(holidayConsumptions[0]);
      buildingsData.push(weekConsumptions);
    }
    return this.prepareProfileChart(serviceType ,buildingsData);
  }

  /*
    8-day profile chart prepare
  */
  private prepareProfileChart(serviceType: ServiceType, weekConsumptions){
    const dataset = [
      {
        seriesName: 'Sunday',
        color: '#4caf50',
        data: []
      },
      {
        seriesName: 'Monday',
        color: '#f44336',
        data: []
      },
      {
        seriesName: 'Tuesday',
        color: '#e91e63',
        data: []
      },
      {
        seriesName: 'Wednesday',
        color: '#9c27b0',
        data: []
      },
      {
        seriesName: 'Thursday',
        color: '#3f51b5',
        data: []
      },
      {
        seriesName: 'Friday',
        color: '#2196f3',
        data: []
      },
      {
        seriesName: 'Saturday',
        color: '#009688',
        data: []
      },
      {
        seriesName: 'Holiday',
        color: '#B15928',
        data: []
      }
    ];

    dataset.forEach(element => {
      for (let i = 0; i < 48; i++) {
        element.data.push({
          value: null,
          toolText: ''
        });
      }
    });

    weekConsumptions.forEach(building => {
      building.forEach(day => {
        if (day) {
          dataset.find(series => series.seriesName == day.name).data.forEach((x, i) => {
            x.value += day.data[i].value;
            x.toolText = `Time: $label{br}Consumption: ${
              this.thousandSeparator.transform(fixDecimalNumPrecision(x.value, this.config.siteConfigurations.decimalNumPrecision))
            } ${
              serviceType === ServiceType.ELECTRICAL ? 'kWh' : 'm³'
            }`;
          });
        }
      });
    });

    let chart = {...this.config.chartConfigurations["profileChart"]};
    chart.yAxisName = this.config.chartConfigurations.chartCustomStrings['profile-chart'][serviceType].yAxisName;

    return {
      chart,
      categories: this.config.chartConfigurations.profileChartCategories,
      dataset
    };
  }

  /*
    Get empty profile chart
  */
 getEmptyProfileChart(serviceType: ServiceType) {
  return this.prepareProfileChart(serviceType ,[]);
 }


  /*
    Overall consumption site
  */
  async getOverallConsumptionSite(serviceType: ServiceType, from: Date, to: Date) {
    let data = await this.dataService.get(this.config.endPoints['site-consumption-data-mode'],
      {
        siteId: this.config.siteConfigurations.siteId,
        startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
        serviceTypeId: serviceType,
        dataMode: DataMode.OverallSum,
        groupId: GroupBy.None,
        interval: Interval.SecondaryThirtyMin
      }).toPromise();
    if(data !== undefined && data !== null && data.length !== 0) {
      return data[0].data[0].value;
    } else {
      return null;
    }
  }

  /*
    Overall consumption building
  */
 async getOverallConsumptionBuilding(serviceType: ServiceType, from: Date, to: Date, buildingId: number) {
  let data = await this.dataService.get(this.config.endPoints['building-type-consumption'],
  {
    siteId: this.config.siteConfigurations.siteId,
    startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
    endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
    serviceTypeId: serviceType,
    buildingId: buildingId,
    dataMode: DataMode.OverallSum,
    groupId: GroupBy.None,
    interval: Interval.SecondaryThirtyMin
  }).toPromise();

  return this.prepareOverallConsumption([data]);

 }

 /*
    Overall consumption building group
  */
 async getOverallConsumptionBuildingGroup(serviceType: ServiceType, from: Date, to: Date, groupId: number) {
  let data = [];
  let buildings: Building[] = this.initialService.navigationStore.getBuildingsByBuildingGroup(groupId);

  for(let building of buildings){
    let buildingData = await this.dataService.get(this.config.endPoints['building-type-consumption'],
    {
      siteId: this.config.siteConfigurations.siteId,
      startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
      serviceTypeId: serviceType,
      buildingId: building.buildingID,
      dataMode: DataMode.OverallSum,
      groupId: GroupBy.None,
      interval: Interval.SecondaryThirtyMin
    }).toPromise();
    data.push(buildingData);
  }

  return this.prepareOverallConsumption(data);
 }

getCategoryTrends(building: number, interval: intervalGroup, from: any, to: any): Observable<any> {
  let data = [];
  return this.dataService.get(this.config.endPoints['building-type-consumption-group'], {
    startDate: from,
    endDate: to,
    groupId: GroupBy.MeterType,
    serviceTypeId: ServiceType.ELECTRICAL,
    buildingId: building,
    interval: interval,
    siteId: this.config.siteConfigurations.siteId,
    dataMode: DataMode.CategorySum,    
  })

}



/*
  Prepare overall consumption for Group/Building
*/
private prepareOverallConsumption(responses: any[]) {
  let total = null;
  for(let building of responses) {
    if(building !== undefined && building !== null && building.length !== 0) {
      if(building[0].data[0].value !== null && building[0].data[0].value !== undefined) {
        if(total == null) {
          total = building[0].data[0].value;
        } else {
          total += building[0].data[0].value;
        }
      }
    }
  }
  return total;
}

/*
  GFA building
*/
async getGFABuilding(serviceType: ServiceType, buildingId: number) {
    let gfa = await this.gfaService.getBuildingGfa(buildingId);
    return (gfa == null) ? null : gfa.total;
}

/*
  GFA building group
*/
async getGFABuildingGroup(serviceType: ServiceType, groupId: number) {
  let gfa = await this.gfaService.getBuildingGroupGfa(groupId);
  return (gfa == null) ? null : gfa.total;
}

/*
  GFA prepare
*/
private prepareGFA(responses: any[]) {
  let total = null;
  for(let building of responses){
    if(building !== null && building !== undefined) {
      if(building.floorArea != null && building.floorArea != undefined) {
        if(total == null) {
          total = building.floorArea;
        } else {
          total += building.floorArea;
        }
      }
    }
  }
  return total;
}



/*
  Get site todays consumption
*/
async getSiteTodaysConsumption(serviceType: ServiceType, from: Date, to: Date, chartDashboardType: ChartDashboardType) {
  let data = await this.dataService.get(this.config.endPoints["trend-log"],
  {
    startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
    endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
    interval: Interval.ThirtyMin,
    serviceTypeId: serviceType,
    siteId: this.config.siteConfigurations.siteId
  }).toPromise();

  return this.prepareTodaysConsumption([data], chartDashboardType);
}

/*
  Get building todays consumption
*/
async getBuildingTodaysConsumption(serviceType: ServiceType, from: Date, to: Date, buildingId: number, chartDashboardType: ChartDashboardType) {
  let data = await this.dataService.get(this.config.endPoints['trend-log-data-building'],
  {
    startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
    endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
    interval: Interval.ThirtyMin,
    serviceTypeId: serviceType,
    buildingId:  buildingId
  }).toPromise();

  return this.prepareTodaysConsumption([data], chartDashboardType);
}

/*
  Get building group todays consumption
*/
async getBuildingGroupTodaysConsumption(serviceType: ServiceType, from: Date, to: Date, groupId: number, chartDashboardType: ChartDashboardType) {
  let data = [];
  let buildings = this.initialService.navigationStore.getBuildingsByBuildingGroup(groupId);
  for(let building of buildings) {
    let buildingData = await this.dataService.get(this.config.endPoints['trend-log-data-building'],
    {
      startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
      interval: Interval.ThirtyMin,
      serviceTypeId: serviceType,
      buildingId:  building.buildingID
    }).toPromise();
    data.push(buildingData);
  }

  return this.prepareTodaysConsumption(data, chartDashboardType);
}

/*
  Prepare todays consumption empty chart
*/
getTodaysConsumptionEmptyChart(chartDashboardType: ChartDashboardType) {
  return this.prepareTodaysConsumption([null], chartDashboardType);
}

/*
  Prepare todays consumption
*/
private prepareTodaysConsumption(responses: any[], chartType: ChartDashboardType) {
  let data = this.generateTrendDaylyData()[0].data;
  let chart = {...this.config.chartConfigurations["elec-trend-log"]};
  // chart.xAxisName = this.config.chartConfigurations.chartCustomStrings.todaysConsumption[chartType].xAxisName;
  chart.yAxisName = this.config.chartConfigurations.chartCustomStrings.todaysConsumption[chartType].yAxisName;
  chart.exportFileName = this.config.chartConfigurations.chartCustomStrings.todaysConsumption[chartType].exportFileName;
  chart.total = 0;
  for (let building of responses) {
    if (Array.isArray(building)) {
      building[0].data.forEach((element, i) => {
        if (element.value != null) {
          data[i].value += element.value;
          chart.total += data[i].value;
        }
      });
    }
  }

  data.forEach(element => {
    element.value = fixDecimalNumPrecision(element.value, this.config.siteConfigurations.decimalNumPrecision);
    element.toolText = `Time: $label{br}Consumption: ${
      this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.config.siteConfigurations.decimalNumPrecision))
    } ${(chartType === ChartDashboardType.SITE_ELECTRICAL || chartType === ChartDashboardType.BUILDING_ELECTRICAL ) ? 'kWh' : 'm³'}`;
  });

  return {chart, data};
}

/*
  Generate todays trend data
*/
private generateTrendDaylyData(){
  var time0 = new Date().setHours(0, 30, 0, 0);
  let labelAndValue = [];
  for (let i = 0; i < 48; i++) {
    labelAndValue.push({"label": this.datePipe.transform(time0, 'HH:mm')==='00:00'?'24:00':this.datePipe.transform(time0, 'HH:mm'), "value": null});
    time0 = new Date(time0).setTime(new Date(time0).getTime() + 30*60*1000);
  }
  let data = [
    {
      "name": "Nanyang Technological University",
      "data": labelAndValue
    }
  ];
  return data;
}


/*
  Get site equipment distribution
*/
async getSiteEquipmentDistribution(serviceType: ServiceType, from: Date, to: Date, chartDashboardType: ChartDashboardType, chartGroupType: ChartGroupType) {
  let data = await this.dataService.get(
    this.config.endPoints["site-consumption-data-mode"],
    {
      startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
      groupId: GroupBy.BuildingCategory,
      serviceType: serviceType,
      interval: Interval.SecondaryThirtyMin,
      siteId: this.config.siteConfigurations.siteId,
      dataMode: DataMode.OverallSum
    }).toPromise();
    return this.prepareEquipmentDistribution([data], chartDashboardType, DistributionChartType.SMALL, chartGroupType, serviceType);

}

/*
  Get building equipment distribution
*/
async getBuildingEquipmentDistribution(serviceType: ServiceType, from: Date, to: Date, buildingId: number, chartDashboardType: ChartDashboardType, distributionChartType: DistributionChartType, chartGroupType: ChartGroupType) {
  let data = await this.dataService.get(
    this.config.endPoints["eq-distribution-building"],
    {
      startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
      groupId: GroupBy.MeterType,
      serviceTypeId: serviceType,
      buildingId: buildingId,
      interval: Interval.SecondaryThirtyMin,
      siteId: this.config.siteConfigurations.siteId,
      dataMode: DataMode.OverallSum
    }).toPromise();
  return this.prepareEquipmentDistribution([data], chartDashboardType, distributionChartType, chartGroupType, serviceType);
}

/*
  Get building group equipment distribution
*/
async getBuildingGroupEquipmentDistribution(serviceType: ServiceType, from: Date, to: Date, groupId: number, chartDashboardType: ChartDashboardType, distributionChartType: DistributionChartType, chartGroupType: ChartGroupType ) {
  let data = [];
  let buildings = this.initialService.navigationStore.getBuildingsByBuildingGroup(groupId);
  for(let building of buildings) {
    let dataSet = await this.dataService.get(
      this.config.endPoints["eq-distribution-building"],
      {
        startDate: this.datePipe.transform(from, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(to, 'yyyy/MM/dd'),
        groupId: GroupBy.MeterType,
        serviceTypeId: serviceType,
        buildingId: building.buildingID,
        interval: Interval.SecondaryThirtyMin,
        siteId: this.config.siteConfigurations.siteId,
        dataMode: DataMode.OverallSum
      }).toPromise();
    data.push(dataSet);
  }
  return this.prepareEquipmentDistribution(data, chartDashboardType, distributionChartType, chartGroupType, serviceType);
}

/*
  Prepare equipment distribution
*/
private prepareEquipmentDistribution(responses: any[], chartType: ChartDashboardType, distributionChartType: DistributionChartType, chartGroupType: ChartGroupType, serviceType: ServiceType) {

  let processedData = [];

  for (let building of responses) {
    for(let dataItem of building) {
      let isIn = false;
      for(let item of processedData) {
        if (dataItem.name ===  item.label) {
          isIn = true;
        }
      }
      if (!isIn) {
       let color = this.getColorCode(chartGroupType, dataItem.itemId);
        if(color == null) {
          processedData.push(
            {
              label: dataItem.name,
              value: null
            }
          )
        } else {
          processedData.push(
            {
              label: dataItem.name,
              value: null,
              color: color
            }
          )
        }

      }
    }
  }

  for (let building of responses) {
    for(let dataItem of building) {
      const key = processedData.findIndex(element => element.label == dataItem.name);
      if(dataItem.data[0].value != null ) {
        if(processedData[key].value == null) {
          processedData[key].value = dataItem.data[0].value;
        } else {
          processedData[key].value += dataItem.data[0].value;
        }
      }
    }
  }

  let totalValue = 0;
  let unit = 'kWh';
  processedData.forEach(element => {
    if(element.value != null) {
      totalValue += element.value;
    }
  });

  if (serviceType == ServiceType.WATER || serviceType == ServiceType.MAIN_WATER) {
    unit = 'm³';
  }

  processedData.forEach((element, i) => {
    let percentage = fixDecimalNumPrecision(((element.value / totalValue) * 100), this.decimalNumPrecision) + ' %';
    let newValue = element.value;
    let { scalledNumber, suffix, unit } = abbreviateNumber(element.value, serviceType);
    if(unit=='m³'){
      element.value = scalledNumber;
    }else{
      suffix = '';
      element.value = element.value / DevicerNumber.electrical;
    }
    let value = fixDecimalNumPrecision(element.value, DECIMAL_MAP.equipDistributionLg);

    processedData[i] =  {
      displayValue: chartTitle(element.label, this.thousandSeparator.transform(value), unit, percentage, (distributionChartType == DistributionChartType.SMALL), suffix),
      label: element.label,
      value: newValue,
      toolText: `Category: $label<br/>Consumption: ${this.thousandSeparator.transform(value)}${suffix} ${unit}<br/>Percentage: ${percentage}`
    };

    if (element.color !== undefined) {
      processedData[i].color = element.color;
    }
  });

  const chart = {...this.config.chartConfigurations['eq-distribution']};

  let equipDistribution = {
    chart,
    data: processedData
  };
  return equipDistribution;
}


/*
  Get site consumption summery chart
*/
async getSiteConsumptionChart(serviceType: ServiceType, from: Date, to: Date, interval: Interval) {
  let data = await this.dataService.get(this.config.endPoints["trend-log"],
      {
        startDate: from,
        endDate: to,
        interval: interval == Interval.Daily ? Interval.Weekly : interval,
        serviceTypeId: serviceType,
        siteId: this.config.siteConfigurations.siteId
      }).toPromise();
  return this.prepareConsumptionSummeryChart([data], serviceType, interval, to);
}

/*
  Get building consumption summery chart
*/
async getBuildingConsumptionChart(serviceType: ServiceType, from: Date, to: Date, buildingId: number, interval: Interval) {
  let data = await this.dataService.get(this.config.endPoints['trend-log-data-building'],
  {
    startDate: from,
    endDate: to,
    interval: interval == Interval.Daily ? Interval.Weekly : interval,
    serviceTypeId: serviceType,
    buildingId: buildingId
  }).toPromise();
  return this.prepareConsumptionSummeryChart([data], serviceType, interval, to);
}

/*
  Get building group consumption summery chart
*/
async getBuildingGroupConsumptionChart(serviceType: ServiceType, from: Date, to: Date, groupId: number, interval: Interval) {
  let data = [];
  let buildings = this.initialService.navigationStore.getBuildingsByBuildingGroup(groupId);
  for(let building of buildings) {
    let buildingData = await this.dataService.get(this.config.endPoints['trend-log-data-building'],
    {
      startDate: from,
      endDate: to,
      interval: interval == Interval.Daily ? Interval.Weekly : interval,
      serviceTypeId: serviceType,
      buildingId: building.buildingID
    }).toPromise();
    data.push(buildingData);
  }
  return this.prepareConsumptionSummeryChart(data, serviceType, interval, to);
}

/**
 * get empty chart for weekly, monthly, yearly and 5 years trend log charts
 * @param serviceType
 * @param interval
 */
getEmptyConsumptionChart(serviceType: ServiceType, interval: Interval) {
  return this.prepareConsumptionSummeryChart([], serviceType, interval);
}

/*
  Prepare consumption chart
*/
prepareConsumptionSummeryChart(responses: any[], serviceType: ServiceType, interval: Interval, to: any = new Date()) {
  if(serviceType == ServiceType.MAIN_WATER){ serviceType = ServiceType.WATER}
  let data = [];
  switch(interval) {
    case Interval.Daily:
      data = this.generateConsumptionData(7, 'days', 'MMM-dd', to) 
      // this.generateWeekConsumption();
      break;
    case Interval.Weekly:
      data = this.generateConsumptionData(31, 'days', 'MMM-dd', to) 
      // data = this.generateMonthConsumption();
      break;
    case Interval.Monthly:
      data = this.generateConsumptionData(12, 'month', 'MMM-yyyy', to) 
      // data = this.generateYearConsumption();
      break;
    case Interval.Yearly:
      data = this.generateConsumptionData(4, 'years', 'yyyy', to) 
      // data = this.generateFiveYearConsumption();
      break;
  }
  let chart = {...this.config.chartConfigurations["elec-trend-log"]};
  chart.plotToolText = this.config.chartConfigurations.chartCustomStrings.consumptionSummery[serviceType][interval].plotToolText;
  chart.xAxisName = this.config.chartConfigurations.chartCustomStrings.consumptionSummery[serviceType][interval].xAxisName;
  chart.yAxisName = this.config.chartConfigurations.chartCustomStrings.consumptionSummery[serviceType][interval].yAxisName;
  chart.exportFileName = this.config.chartConfigurations.chartCustomStrings.consumptionSummery[serviceType][interval].exportFileName;

  let unit;
  if (serviceType == ServiceType.ELECTRICAL) {
    unit = 'kWh';
  } else {
    unit = 'm³';
  }

  responses.forEach(building => {
    if (building) {
      console.log(data, building[0].data);
      
      data.forEach((dataItem: any = {}, i) => {
        const element = building[0].data[i];
        if(element){
          if (element.value) {
            data[i].value += element.value;
          }
          // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br>Consumption: ${moneyFormat((data[i].value/1000 || 0).toFixed(DECIMAL_MAP.trendLogs))} ${unit}`;
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
              // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
              
              chart.maxColWidth = 64;
              break;
            case Interval.Weekly:
              data[i].label = this.datePipe.transform(element.label, 'MMM-dd');
              // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
              chart.maxColWidth = 20;
              break;
            case Interval.Monthly:
              data[i].label = this.datePipe.transform(element.label, 'MMM-yyyy');
              // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-yyyy')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
              chart.maxColWidth = 42;
              break;
            case Interval.Yearly:
              data[i].label = element.label;
              // data[i].tooltext = `${chart.xAxisName}: ${element.label}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
              chart.maxColWidth = 72;
              break;
            default:
              data[i].label = this.datePipe.transform(element.label, 'yyyy/MMM/dd');
              // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'yyyy/MMM/dd')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
              chart.maxColWidth = 64;
              break;
          }
        }
      })
      // building[0].data.forEach((element: any = {}, i) => {
      //   if(data[i]){
      //     if (element.value) {
      //       data[i].value += element.value;
      //     }
      //     // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br>Consumption: ${moneyFormat((data[i].value/1000 || 0).toFixed(DECIMAL_MAP.trendLogs))} ${unit}`;
      //     if(ServiceType.ELECTRICAL == serviceType || ServiceType.MAIN_HT_ELECTRICAL == serviceType){
      //       const item = data[i];
      //       const newValue = item.value / DevicerNumber.electrical;
      //       data[i] = {
      //         ...item,
      //         value: item.value ? newValue : null,
      //         displayValue: item.value ? moneyFormat((newValue || 0).toFixed(DECIMAL_MAP.trendLogs)) : null,
      //         toolText: "Day: $label <br/> Consumption: $displayValue kWh",
      //       }
      //     }
      //     console.log(data[i]);
      //     switch (interval) {
      //       case Interval.Daily:
      //         data[i].label = this.datePipe.transform(element.label, 'MMM-dd');
      //         // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
              
      //         chart.maxColWidth = 64;
      //         break;
      //       case Interval.Weekly:
      //         data[i].label = this.datePipe.transform(element.label, 'MMM-dd');
      //         // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-dd')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
      //         chart.maxColWidth = 20;
      //         break;
      //       case Interval.Monthly:
      //         data[i].label = this.datePipe.transform(element.label, 'MMM-yyyy');
      //         // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'MMMM-yyyy')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
      //         chart.maxColWidth = 42;
      //         break;
      //       case Interval.Yearly:
      //         data[i].label = element.label;
      //         // data[i].tooltext = `${chart.xAxisName}: ${element.label}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
      //         chart.maxColWidth = 72;
      //         break;
      //       default:
      //         data[i].label = this.datePipe.transform(element.label, 'yyyy/MMM/dd');
      //         // data[i].tooltext = `${chart.xAxisName}: ${this.datePipe.transform(element.label, 'yyyy/MMM/dd')}<br>Consumption: ${this.thousandSeparator.transform(fixDecimalNumPrecision(data[i].value, this.config.siteConfigurations.decimalNumPrecision))} ${unit}`;
      //         chart.maxColWidth = 64;
      //         break;
      //     }
      //   }
      // });
    }
  });

  return {chart, data};
}

private getConvertedDateString(date, interval) {
  switch (interval) {
    case Interval.Daily:
      return this.datePipe.transform(date, 'MMM-dd');
    case Interval.Weekly:
      return this.datePipe.transform(new Date(date), 'MMM-dd');
    case Interval.Monthly:
      return this.datePipe.transform(date, 'yyyy-MMM');
    case Interval.Yearly:
      return this.datePipe.transform(date, 'yyyy');
  }
}

/*
  Generate week consumption
  
*/

private generateConsumptionData = (totalDay: number = 7, keyDate: string = 'days', dateFormat: string = 'MM-dd', to: any = this.getDemoDate()) => {
  let data = [];
  to = dateGapGenerator(new Date(to), 1)
  if(keyDate == 'years'){
    for (let i = totalDay; i >= 0; i--) {
      data.push({
        label: this.datePipe.transform(to.setFullYear(to.getFullYear() - i), 'yyyy'),
        value: null,
        tooltext: ''
      });
    }
  }else{
    let lastdayList = this.dateService.getLastDays(to, totalDay, keyDate);
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

/*
  Generate month consumption
*/
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

/*
  Generate year consumption
*/
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

/*
  Generate 5 year consumption
*/
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

/*
  Get Demo Date
*/
private getDemoDate() {
  if (this.config.config.demo) {
    return new Date(this.config.config.demoDate);
  } else {
    return  new Date();
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
    return this.config.config.defaultColorCode;
  } else {
    color = find(item.attributes, {textId: this.config.config.attributes.COLOR_CODE});
    return color===null || color === undefined?this.config.config.defaultColorCode:color.value;
  }
}

/*
  Get site equipment breakdown
*/
async getSiteEquipmentBreakdown(serviceType: ServiceType, dateRange: DateRange) {
  try {
    const rows = [];
    const data = await this.dataService.get(this.config.endPoints['site-eq-breakdown'], {
      from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd hh:mm a'),
      to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd hh:mm a'),
      serviceTypeId: serviceType,
      interval: Interval.SecondaryThirtyMin,
      groupBy: GroupBy.Building,
      dataMode: DataMode.OverallSum,
    }).toPromise();
    data.forEach(element => {
      let { scalledNumber, suffix, unit } = abbreviateNumber(element.Value, serviceType);
      let consumption = scalledNumber+suffix;
      if(serviceType == ServiceType.ELECTRICAL){
        consumption = moneyFormat((element.Value / DevicerNumber.electrical).toFixed(DECIMAL_MAP.electricalBreakDown));
      }
      rows.push({
        category: element.BuildingCategoryName,
        building: element.BuildingName,
        noOfMeters: element.MeterCount,
        consumption: consumption
      });
    });
    return rows;
  } catch (err) {
    console.log(err);
  }
}

async getBuildingGroupEqBreakDown(groupId, serviceType: ServiceType, dateRange: DateRange) {
  try {
    const data = await this.dataService.get(this.config.endPoints["building-group-eq-breakdown"], {
      groupId,
      from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd hh:mm a'),
      to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd hh:mm a'),
      serviceTypeId: serviceType,
      interval: Interval.SecondaryThirtyMin,
      groupBy: GroupBy.Meter,
      dataMode: DataMode.OverallSum
    }).toPromise();
    const returnData = [];
    data.forEach(element => {
      returnData.push({
        group: {name: element.BuildingGroupName, id: groupId},
        block: {name: element.BuildingName, id: element.BuildingID},
        meter: {name: element.MeterName, id: element.MeterID, value: element.Value},
        level: {name: element.LevelName, id: element.LevelID},
        eqType: {name: element.MeterTypeName, id: element.MeterTypeID},
        eqCode: {name: element.MeterName, id: element.MeterID},
        value: {name: element.Value, id: null}
      });
    });
    return returnData;
  } catch (error) {
    console.log(error);
  }
}

}
