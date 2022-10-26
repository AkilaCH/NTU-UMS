import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { ServiceType } from 'src/enums/ServiceType';
import { InitialService } from '../initial.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDashboardService {

  constructor(
    private httpService: HttpService,
    private configs: InitialService,
    private initialService: InitialService
  ) { }

  /**
   * get low tension meters and water meters
   * @param serviceTypeId
   * @param buildingGroupId
   * @param buildingId
   */
  async getLtWaterMeters(serviceTypeId: ServiceType, buildingGroupId, buildingId) {
    try {
      const res = await this.httpService.get(this.configs.endPoints['get-lt-water-meters'], {
        siteId: this.configs.siteConfigurations.siteId,
        serviceTypeId,
        buildingGroupId,
        buildingId
      }).toPromise();
      let data = [];
      if (res.length != 0) {
        res.forEach(element => {
          data.push({
            buildingGroup: {id: element.buildingGroupId, name: element.buildingGroupName},
            building: {id: element.buildingId, name: element.buildingName},
            level: {id: element.levelID, name: element.level},
            location: {id: element.locationID, name: element.location},
            meter: {id: element.meterID, name: element.meterName},
            meterType: {id: element.meterTypeID, name: element.meterTypeName},
            relationship: {id: null, name: element.meterRelationship},
            opcTag: {id: null, name: element.opcTag}
          });
        });
      }
      return data;
    } catch (e) {
      return [];
    }
  }

  /**
   * add low tension meter or water meters
   * @param serviceTypeId
   * @param body
   */
  async addLtWaterMeters(serviceTypeId: ServiceType, body) {
    try {
      const res = await this.httpService.post(this.configs.endPoints['add-lt-water-meters'], body, {
        siteId: this.configs.siteConfigurations.siteId,
        serviceTypeId
      }).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }

  async deleteMeter(data, serviceMode){
    try{
      const res = await this.httpService.put(this.configs.endPoints["meter-state"],{
        siteId: this.configs.siteConfigurations.siteId,
        serviceMode: serviceMode
      }, data).toPromise();
  
      return res === null?[]:res;
    }catch(e){
      return [];
    }
  }

  /**
   * update low tension meter or water meters
   * @param serviceTypeId
   * @param body 
   */
  async updateLtWaterMeters(serviceTypeId: ServiceType, body) {
    try {
      const res = await this.httpService.put(this.configs.endPoints['update-lt-water-meters'], {
        siteId: this.configs.siteConfigurations.siteId,
        serviceTypeId
      },
      body
      ).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }

  /**
   * get high tension electrical meters
   * @param htLoopId
   */
  async getHtMeters(htLoopId) {
    try {
      const res = await this.httpService.get(this.configs.endPoints['get-ht-meters'], {
        siteId: this.configs.siteConfigurations.siteId,
        htLoopId
      }).toPromise();
      let data = [];
      if (res.length != 0) {
        res.forEach(element => {
          data.push({
            meter: {id: element.meterID, name: element.meterName},
            loop: {id: element.htLoopID, name: element.htLoopName},
            substation: {id: element.subStationID, name: element.subStationName},
            opcTag: {id: null, name: element.opcTag},
          });
        });
      }
      return data;
    } catch (e) {
      return [];
    }
  }

  /**
   * add high tension meters or water meters
   * @param body
   */
  async addHtMeters(body) {
    try {
      const res = await this.httpService.post(this.configs.endPoints['add-ht-meters'], body, {
        siteId: this.configs.siteConfigurations.siteId
      }).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }

  /**
   * update low tension meter or water meters
   * @param body
   */
  async updateHtMeters(body) {
    try {
      const res = await this.httpService.put(this.configs.endPoints['update-ht-meters'], {
        siteId: this.configs.siteConfigurations.siteId
      },
      body
      ).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }

  /**
   * get chiller meters
   * @param chillerPlantId
   */
  async getChillerMeters(chillerPlantId) {
    try {
      const res = await this.httpService.get(this.configs.endPoints['get-chiller-meters'], {
        siteId: this.configs.siteConfigurations.siteId,
        chillerPlantId
      }).toPromise();
      let data = [];
      if (res.length != 0) {
        res.forEach(element => {
          data.push({
            plant: {id: element.chillerPlantID, name: element.chillerPlantName},
            equipmentType: {id: element.equipmentTypeID, name: element.equipmentTypeName},
            equipment: {id: element.equipmentID, name: null},
            meter: {id: element.meterID, name: element.meterName},
            opcTag: {id: null, name: element.opcTag},
          });
        });
      }
      return data;
    } catch (e) {
      return [];
    }
  }

  /**
   * add chiller meter
   * @param chillerPlantId
   * @param body
   */
  async addChillerMeters(chillerPlantId, body) {
    try {
      const res = await this.httpService.post(this.configs.endPoints['add-chiller-meters'], body, {
        siteId: this.configs.siteConfigurations.siteId,
        chillerPlantId
      }).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }

  /**
   * update chiller meter
   * @param chillerPlantId
   * @param body
   */
  async updateChillerMeters(chillerPlantId, body) {
    try {
      const res = await this.httpService.put(this.configs.endPoints['update-chiller-meters'], {
        siteId: this.configs.siteConfigurations.siteId,
        chillerPlantId
      },
      body).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }

  /**
   * update service mode
   * @param serviceTypeId
   * @param body
   */
  async updateMeterStatus(serviceTypeId: ServiceType, body) {
    try {
      const res = await this.httpService.put(this.configs.endPoints['meter-state'], {
        siteId: this.configs.siteConfigurations.siteId,
        serviceMode: serviceTypeId
      },
      body).toPromise();
      return res === null ? [] : res;
    } catch (e) {
      return [];
    }
  }
}
