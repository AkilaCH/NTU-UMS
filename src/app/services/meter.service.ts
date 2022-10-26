import { HttpService } from 'src/app/services/http.service';
import { Interval } from '../../enums/intervals';
import { DataMode } from '../../enums/DataMode';
import { GroupBy } from '../../enums/group-by';
import { DateServiceService } from './date-service.service';
import { InitialService } from './initial.service';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeterService {
  today: any;
  constructor(
    private http: HttpService,
    private configs: InitialService,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private datePipe: DatePipe
  ) {}

  async getBuildingMeterTree(buildingId, serviceType, isDirectMode = true) {
    this.setDemoDate();
    const dataSource = [];

    const building = await this.http.get(
      this.configs.endPoints.buildings,
      {
        buildingId
      }
    ).toPromise();

    const buildingConsumtion = await this.http.get(
      this.configs.endPoints['building-type-consumption'],
      {
        buildingId,
        serviceTypeId: serviceType,
        startDate: this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).start, 'yyyy/MM/dd hh:mm a'),
        endDate:  this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).end, 'yyyy/MM/dd hh:mm a'),
        interval: Interval.ThirtyMin,
        dataMode: DataMode.OverallSum
      }
    ).toPromise();

    const meterConsumptions = await this.http.get(
      this.configs.endPoints['building-meter-consumption'],
      {
        buildingId,
        serviceTypeId: serviceType,
        startDate: this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).start, 'yyyy/MM/dd hh:mm a'),
        endDate:  this.datePipe.transform(this.dateService.getTodayUpToNow(this.today).end, 'yyyy/MM/dd hh:mm a'),
        interval: Interval.ThirtyMin,
        dataMode: DataMode.OverallSum,
        groupId: GroupBy.Meter
      }
    ).toPromise();

    const meterLevels = await this.getMeterLevel(meterConsumptions);

    if (isDirectMode) {
      return {
        name: building.buildingName,
        meter: buildingConsumtion[0].data[0].value,
        quality: 1,
        description: '',
        parent: null,
        children: [...meterLevels]
      };
    } else {
      dataSource.push({
        name: building.buildingName,
        description: '',
        meter: buildingConsumtion[0].data[0].value,
        quality: 1,
        children: [...meterLevels]
      });
    }
    return dataSource;
  }

  async getGroupMeterTree(buildingGroupId, serviceType) {
    const buildingGroup = await this.http.get(
      this.configs.endPoints['site-building-group'],
      {siteId: 1, groupId: buildingGroupId}
    ).toPromise();

    const buildings = await this.http.get(
      this.configs.endPoints['site-building-group-all-buildings'],
      { siteId: 1, groupId: buildingGroupId }
    ).toPromise();

    let totalGroupConsumption = null;
    const buildingGroupData = [];

    for (const building of buildings) {
      const buildingMeters: any = await this.getBuildingMeterTree(building.buildingID, serviceType, false);
      buildingGroupData.push(...buildingMeters);
    }
    buildingGroupData.forEach(item => {
      if  (totalGroupConsumption !== null){
        totalGroupConsumption += item.meter;
      } else {
        totalGroupConsumption = item.meter;
      }
    });

    return {
      name: buildingGroup.description,
      description: '',
      quality: 1,
      parent: null,
      meter: totalGroupConsumption,
      children: buildingGroupData
    };
  }

  async getMeterLevel(dataSource) {
    let obj = {};

    let min = Math.min(...dataSource.map(x => x.meterRelationship.split('.').length));
    let max = Math.max(...dataSource.map(x => x.meterRelationship.split('.').length));

    for (min; min <= max; min++) {
        obj[min] = [];
    }

    dataSource.forEach(element => {
        obj[element.meterRelationship.split('.').length].push({
            name: element.meterName,
            quality: element.quality,
            description: element.meterRelationship,
            meter: element.value,
            children: []
        })
    });

    min = Math.min(...dataSource.map(x => x.meterRelationship.split('.').length));

    for (max; max >= min; max--) {
        obj[max].forEach(x => {
            addChild(x, max - 1);
        });
    }

    function addChild(x, max) {
        if (obj[max]) {
            let matched = false;
            for (const y of obj[max]) {
                if (y.description.split('.', max).join('.') == x.description.split('.', max).join('.')) {
                    y['children'].push(x);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                addChild(x, max - 1);
            }
        } else {
          if (x.description.split('.').length != min && !obj[min].some(z => z.name == x.name)) {
              obj[min].push(x);
          }
      }
    }

    return obj[min];
  }

  sortMeters() {

  }

  private setDemoDate() {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
  }
}
