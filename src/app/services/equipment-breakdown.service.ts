import { Injectable, EventEmitter } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import { HttpService } from './http.service';
import map from 'lodash/map';
import assign from 'lodash/assign';
import find from 'lodash/find';
import { Interval } from 'src/enums/intervals';
import { DataMode } from 'src/enums/DataMode';
import { GroupBy } from 'src/enums/group-by';
import {DatePipe} from '@angular/common';
import { InitialService } from './initial.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentBreakdownService {
  breakDownDataOnRecieve: EventEmitter<any> = new EventEmitter();
  constructor(
    private dataService: HttpService,
    private configs: InitialService,
    private datePipe: DatePipe,
  ) { }

  public requestMeterData(buildings): Observable<any[]> {
    return forkJoin([...buildings]);
  }

  public async requestBuildingData(buildingId?, buildingName?, groupId?, groupName? ,serviceType?, fromDate?, toDate?) {
    const processedData = [];
    const buildingMeters = await this.dataService.get(
      this.configs.endPoints['building-service-type-all-meters'],
       {buildingId, serviceTypeId: serviceType} ).toPromise();

    const consumption =  await this.dataService.get(
      this.configs.endPoints['building-meter-consumption'],
        {
          buildingId,
          serviceTypeId: serviceType,
          startDate: this.datePipe.transform(fromDate, 'yyyy/MM/dd'),
          endDate: this.datePipe.transform(toDate, 'yyyy/MM/dd'),
          interval: Interval.SecondaryThirtyMin,
          dataMode: DataMode.OverallSum,
          groupId: GroupBy.Meter
        } ).toPromise();

    const arrResult = map( buildingMeters, obj => {
        return assign(obj, find( consumption, {
          meterId: obj.meterID
          }));
        });
    arrResult.forEach(item => {
        processedData.push(
          {
            group: {name: groupName, id: groupId},
            block: {name: buildingName, id: buildingId},
            meter: {name: item.meterName, id: item.meterID, value: item.value},
            level: {name: item.level, id: item.levelID},
            eqType: {name: item.meterType, id: item.meterTypeID},
            eqCode: {name: item.meterName, id: item.meterID}
          }
        );
    });
    return processedData;
  }

  public async requestBuildingGroupData(groupId, groupName, serviceType, fromDate, toDate){
    const processedData = [];
    const buildings = await this.dataService.get(this.configs.endPoints['site-building-group-all-buildings'], {
      siteId: 1,
      groupId
    }).toPromise();

    for (const building of buildings) {
      const buildingData: any = await this.requestBuildingData(
        building.buildingID,
        building.buildingName,
        groupId, groupName,
        serviceType,
        fromDate,
        toDate
        );
      processedData.push(...buildingData);
    }
    return processedData;
  }
}
