import { DatePipe } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { Injectable } from '@angular/core';
import { InitialService } from '../initial.service';
import { NotifierService } from 'angular-notifier';
import { GroupName } from 'src/enums/group-name.enum';
import { HttpClient } from '@angular/common/http';
import { buildPlaceholder } from 'src/util/StringHelper';
import { Plant } from 'src/app/models/plant';
import sortBy from 'lodash/sortBy';

@Injectable({
  providedIn: 'root'
})
export class GreenmarkDataFetchingService {

  plantList: any;
  private groupId: number;
  private readonly notifier: NotifierService;

  constructor(
    private httpService: HttpService,
    private intialService: InitialService,
    private configs: InitialService,
    private datePipe: DatePipe,
    private notifierService: NotifierService,
    private http: HttpClient
  ) {
    this.notifier = this.notifierService;
  }

  async getPlants() {
    try {
      const plants = [];
      const res: Plant[] = await this.httpService.get(this.configs.endPoints['site-all-chillers'], {
        siteId: this.configs.siteConfigurations.siteId
      }).toPromise();
      this.plantList = sortBy(res, (o) => o.name);
      this.plantList.forEach(element => {
        plants.push(
          {
            name: element.name,
            id: element.chillerPlantID
          }
        );
      });
      return res === null ? [] : plants;
    } catch (e) {
      this.plantList = [];
      return [];
    }
  }

  async getEquipmentId(plantId: number, equipmentName: string) {
    const equipmentTypes = this.plantList.find(x => x.chillerPlantID == plantId).equipmentTypes;
    const equipment = equipmentTypes.find(x => x.name == equipmentName);
    if (equipment && equipment.equipmentTypeID) {
      return equipment.equipmentTypeID;
    } else {
      return null;
    }
  }

  async getEquipments(plantId: number, equipmentTypeId: number) {
    try {
      const equipments = [];
      const res = await this.httpService.get(this.configs.endPoints['chiller-equipments'], {
        plant_id: plantId,
        equipment_type_id: equipmentTypeId
      }).toPromise();
      res.forEach(element => {
        equipments.push({
          name: element.name,
          id: element.equipmentID
        });
      });
      return res === null ? [] : equipments;
    } catch (e) {
      return [];
    }
  }

  async fetchHeatBalanceData(dateRange, plantId, frequency) {
    const chartConfigs = this.intialService.getGreenmarkData()['heat-balance'];
    const plant = chartConfigs.find(x => x.chillerPlantID == plantId);
    this.groupId = plant.groupId;
    try {
      let res = await this.httpService.get(this.configs.endPoints['heat-balance'] , {
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
        groupName: GroupName.Plant,
        groupId: plant.groupId,
        frequency
      }).toPromise();
      return res.StatusCode || res.errors ? [] : res;
    } catch (e) {
      return null;
    }
  }

  async fetchChillerEfficiencyData(dateRange, plantId, chillerId, frequency) {
    const chartConfigs = this.intialService.getGreenmarkData()['chiller-efficiency'];
    const chillers = chartConfigs.find(x => x.chillerPlantID == plantId);
    const chiller = chillers.chillers.find(x => x.equipmentId == chillerId);
    this.groupId = chiller.groupId;
    try {
      let res = await this.httpService.get(this.configs.endPoints['chiller-efficiency'], {
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
        groupName: GroupName.Plant,
        groupId: chiller.groupId,
        frequency
      }).toPromise();
      return res[0].StatusCode || res.errors ? [] : res;
    } catch (e) {
      return [];
    }
  }

  async fetchCarbonFootPrintData(dateRange, plantId, frequency) {
    const chartConfigs = this.intialService.getGreenmarkData()['carbon-footprint'];
    const plant = chartConfigs.find(x => x.chillerPlantID == plantId);
    this.groupId = plant.groupId;
    try {
      let res = await this.httpService.get(this.configs.endPoints['carbon-footprint'], {
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
        groupName: GroupName.Plant,
        groupId: plant.groupId,
        frequency
      }).toPromise();
      return res[0].StatusCode || res.errors ? [] : res;
    } catch (e) {
      return [];
    }
  }

  async fetchCondenserPerformanceData(dateRange, plantId, headerId, frequency) {
    const chartConfigs = this.intialService.getGreenmarkData()['condenser-performance'];
    const plant = chartConfigs.find(x => x.chillerPlantID == plantId);
    const header = plant.headers.find(x => x.equipmentId == headerId);
    this.groupId = header.groupId;
    try {
      let res = await this.httpService.get(this.configs.endPoints['condenser-performance'], {
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
        groupName: GroupName.Plant,
        groupId: header.groupId,
        frequency
      }).toPromise();
      return res[0].StatusCode || res.errors ? [] : res;
    } catch (e) {
      return [];
    }
  }

  async exportChart(dateRange, frequency, reportType, plantId, equipmentId?) {

    try {
      let url
      if (equipmentId) {
        url = buildPlaceholder(`${this.intialService.getHost()}/${this.configs.endPoints['green-mark-export']}`, {
          from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
          to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
          groupName: GroupName.Plant,
          groupId: this.groupId,
          frequency,
          reportType,
          plantId,
          childId: equipmentId ? equipmentId : 0
        });
      } else {
        url = buildPlaceholder(`${this.intialService.getHost()}/${this.configs.endPoints['heat-balance-export']}`, {
          from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
          to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd'),
          groupName: GroupName.Plant,
          groupId: this.groupId,
          frequency,
          reportType,
          plantId
        });
      }

      let newTab = window.open(url);

      if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
        throw new TypeError('File downloading error');
      } else {
        this.notifier.notify('success', 'Report Exported Successfully');
      }
    } catch (e) {
      this.notifier.notify('error', 'Something Went Wrong');
    }
  }
}
