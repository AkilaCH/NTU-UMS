import { Injectable } from '@angular/core';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import { HttpService } from '../http.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from 'src/app/store/navigation.service';
import { ServiceType } from 'src/enums/ServiceType';
import { BenchMarkType } from 'src/enums/bench-mark-type.enum';
import { buildPlaceholder } from 'src/util/StringHelper';
import { InitialService } from '../initial.service';
import { NotifierService } from 'angular-notifier';
import { fixDecimalNumPrecision } from 'src/util/ChartHelper';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private readonly notifier: NotifierService;

  constructor(
    private http: HttpService,
    private datePipe: DatePipe,
    private config: InitialService,
    private navigationService: NavigationService,
    private initialService: InitialService,
    private notifierService: NotifierService,
    private thousandSeparator: ThousandSeparatorPipe
  ) {
    this.notifier = this.notifierService;
  }

  async getLDWaterSummeryData(dateRange: DateRange) {
    try {
      const res = await this.http.get(this.config.endPoints['ld-water-alerts'], {
        siteId: this.config.siteConfigurations.siteId,
        serviceType: ServiceType.LD_WATER,
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')
      }).toPromise();
      if (Array.isArray(res)) {
        const data = [];
        res.forEach(element => {
          data.push({
            id: element.guid,
            time: this.datePipe.transform(element.from, 'MM/dd/yyyy HH:mm a', 'Z'),
            meters: `${element.meterA} and ${element.meterB}`,
            meterAId: element.meterAId,
            meterBId: element.meterBId,
            scenarioId: element.ldModelId,
            scenario: element.ldModelId === 1 ? 'Without sub meters between main ring meters' : 'With sub meters between main ring meters',
            maxError: fixDecimalNumPrecision(element.maxError, this.config.siteConfigurations.decimalNumPrecision),
            error: fixDecimalNumPrecision(element.error, this.config.siteConfigurations.decimalNumPrecision),
            status: element.status === 1 ? 'Pending' : 'Acknowledged',
            buttonGroupAction: [{ buttonName: 'Acknowledge', actionKey: 'acknowledge' }]
          });
        });
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getWaterMeters(serviceType: ServiceType, buildingGroupId: number, buildingId: number) {
    try {
      const res = await this.http.get(this.config.endPoints['get-lt-water-meters'], {
        siteId: this.config.siteConfigurations.siteId,
        serviceTypeId: serviceType,
        buildingGroupId,
        buildingId
      }).toPromise();
      if (Array.isArray(res)) {
        return res;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async acknowledgeLDAlerts(body) {
    try {
      const res = await this.http.post(this.config.endPoints['acknowledge-alerts'], body, {}).toPromise();
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async exportLDAlerts(dateRange: DateRange, ldModelId) {
    try {
      const url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints['alert-ld-water-export']}`, {
        from: this.datePipe.transform(dateRange.start, 'yyyy/MM/dd HH:mm a'),
        to: this.datePipe.transform(dateRange.end, 'yyyy/MM/dd HH:mm a'),
        serviceType: ServiceType.LD_WATER,
        ldModelId
      });
      this.downloadAsExcel(url);
    } catch (error) {
      console.log(error);
    }
  }

  async getLDWaterConfigurationData() {
    try {
      const res = await this.http.get(this.config.endPoints['ld-water-config'], {
        siteId: this.config.siteConfigurations.siteId,
        serviceType: ServiceType.LD_WATER
      }).toPromise();
      const data = [];
      res.forEach(element => {
        data.push({
          id: element.ldScenarioId,
          status: element.status == 1,
          scenarioId: element.ldModelId,
          meterA: element.meterAName,
          meterAId: element.meterAId,
          meterB: element.meterBName,
          meterBId: element.meterBId,
          subMeters: element.subMeters ? element.subMeters : [],
          edit: false
        });
      });
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addNewLdScenario(body) {
    try {
      const req = await this.http.post(this.config.endPoints['add-ld-scenario'], body, {}).toPromise();
      return req;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async changeLDConfigScenario(body) {
    try {
      const req = await this.http.post(this.config.endPoints['ld-config-status'], body, {}).toPromise();
      return req;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getChillerAlertSummaryData(dateRange: DateRange) {
    try {
      let data = await this.http.get(this.config.endPoints['chiller-alerts'], {
        siteId: this.config.siteConfigurations.siteId,
        from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
        to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`
      }).toPromise();
      let processedData = [];
      data.forEach(element => {
        if (this.navigationService.getPlantById(element.chillerPlantId)[0]) {
          processedData.push( {
            id: { name: element.guid, id: element.guid },
            time: { name: this.datePipe.transform(element.timeStamp, 'yyyy/MM/dd HH:mm', 'Z'), id: 0 },
            equipment: { name: element.meterName, id: element.meterID },
            detectedValue: {
  name: this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.config.siteConfigurations.decimalNumPrecision)),
              id: 0
            },
            benchmarkValue: { name: this.thousandSeparator.transform(element.benchmarkValue), id: 0 },
            status: { name:  element.currentStatus == 0 ? 'Acknowledged' : 'Pending', id: 0 },
            plant: {
              name: this.navigationService.getPlantById(element.chillerPlantId)[0].name,
              id: element.chillerPlantId
            },
            location: { name: element.locationName, id: element.locationID }
          });
        }
      });
      return processedData;
    } catch (e) {
      return null;
    }
  }

  async getWaterElectAlertSummary(dateRange: DateRange, serviceType: ServiceType) {
    try {
      let data = await this.http.get(this.config.endPoints['water-elec-alerts'], {
        siteId: this.config.siteConfigurations.siteId,
        from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
        to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
        serviceType
      }).toPromise();
      let processedData = [];
      data.forEach(element => {
        if (this.navigationService.getBuildingGroupById(element.buildingGroupID)[0] && this.navigationService.getBuilding(element.buildingID)[0] && this.navigationService.getLevelById(element.levelID)[0]) {
          processedData.push( {
            id: { name: element.guid, id: element.guid },
            time: { name: this.datePipe.transform(element.timeStamp, 'yyyy/MM/dd HH:mm', 'Z'), id: 0 },
            buildingGroup: {
              name: this.navigationService.getBuildingGroupById(element.buildingGroupID)[0].description,
              id: element.buildingGroupID
            },
            building: {
              name: this.navigationService.getBuilding(element.buildingID)[0].buildingName,
              id: element.buildingID
            },
            level: {
              name: this.navigationService.getLevelById(element.levelID)[0].floorName,
              id: element.levelID
            },
            location: { name: element.locationName, id: element.locationID },
            equipment: { name: element.meterName, id: element.meterID },
            detectedValue: {
name: this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.config.siteConfigurations.decimalNumPrecision)),
              id: 0
            },
            benchmarkValue: { name: this.thousandSeparator.transform(element.benchmarkValue), id: 0 },
            status: { name: element.currentStatus == 0 ? 'Acknowledged' : 'Pending', id: 0 }
          });
        }
      });
      return processedData;
    } catch (e) {
      return null;
    }
  }

  async getHTAlertAlertSummary(dateRange: DateRange, serviceType: ServiceType) {
    try {
      let data = await this.http.get(this.config.endPoints['ht-alerts'], {
        siteId: this.config.siteConfigurations.siteId,
        from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
        to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
        serviceType
      }).toPromise();
      let processedData = [];
      data.forEach(element => {
        if (this.navigationService.getLoopById(element.htLoopId)[0] && this.navigationService.getSubstationById(element.substationId)[0]) {
          processedData.push( {
            id: { name: element.guid, id: element.guid },
            time: { name: this.datePipe.transform(element.timeStamp, 'yyyy/MM/dd HH:mm', 'Z'), id: 0 },
            equipment: { name: element.meterName, id: element.meterID },
            detectedValue: {
          name: this.thousandSeparator.transform(fixDecimalNumPrecision(element.value, this.config.siteConfigurations.decimalNumPrecision)),
              id: 0
            },
            benchmarkValue: { name: this.thousandSeparator.transform(element.benchmarkValue), id: 0 },
            status: { name:  element.currentStatus == 0 ? 'Acknowledged' : 'Pending', id: 0 },
            loop: {
              name: this.navigationService.getLoopById(element.htLoopId)[0].htLoopName,
              id: element.htLoopId
            },
            substation: {
              name: this.navigationService.getSubstationById(element.substationId)[0].subStationName,
              id: element.substationId
            },
            location: { name: element.locationName, id: element.locationID }
          });
        }
      });
      return processedData;
    } catch (e) {
      return null;
    }
  }

  async getElecWaterConfigurationData(serviceType: ServiceType) {
    try {
      let data = await this.http.get(this.config.endPoints['elec-water-alert-config'], {
        siteId: this.config.siteConfigurations.siteId,
        serviceType
      }).toPromise();
      const processedData = [];
      data.forEach(element => {
if (this.navigationService.getBuildingGroupById(element.buildingGroupID)[0] && this.navigationService.getBuilding(element.buildingID)[0]) {
          processedData.push({
            toggle: element.status == 1,
            equipment: element.meterName,
            mondayBenchMark: this.thousandSeparator.transform(element.benchmarkDay2),
            tuesdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay3),
            wednesdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay4),
            thursdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay5),
            fridayBenchMark: this.thousandSeparator.transform(element.benchmarkDay6),
            saturdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay7),
            sundayBenchMark: this.thousandSeparator.transform(element.benchmarkDay1),
            changeMode: [
              {key: 'auto', text: 'Auto', selected: element.benchmarkType == BenchMarkType.Auto},
              {key: 'manual', text: 'Manual', selected: element.benchmarkType == BenchMarkType.Manual}
            ],
            buildingGroup: {
              name: this.navigationService.getBuildingGroupById(element.buildingGroupID)[0].description,
              id: element.buildingGroupID
            },
            building: {
              name: this.navigationService.getBuilding(element.buildingID)[0].buildingName,
              id: element.buildingID
            },
            level: { name: element.floorName, id: element.levelID },
            location: { name: element.locationName, id: element.locationID },
            meterID: element.meterID
          });
        }
      });
      return processedData;
    } catch (e) {
      return null;
    }
  }

  async getChillerConfigurationData() {
    try {
      const data = await this.http.get(this.config.endPoints['chiller-alert-config'], {
        siteId: this.config.siteConfigurations.siteId
      }).toPromise();
      const processedData = [];
      data.forEach(element => {
        if (this.navigationService.getPlantById(element.chillerPlantId)[0]) {
          processedData.push({
            toggle: element.status == 1,
            equipment: element.meterName,
            mondayBenchMark: this.thousandSeparator.transform(element.benchmarkDay2),
            tuesdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay3),
            wednesdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay4),
            thursdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay5),
            fridayBenchMark: this.thousandSeparator.transform(element.benchmarkDay6),
            saturdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay7),
            sundayBenchMark: this.thousandSeparator.transform(element.benchmarkDay1),
            changeMode: [
              {key: 'auto', text: 'Auto', selected: element.benchmarkType == BenchMarkType.Auto},
              {key: 'manual', text: 'Manual', selected: element.benchmarkType == BenchMarkType.Manual}
            ],
            plant: {
              name: this.navigationService.getPlantById(element.chillerPlantId)[0].name,
              id: element.chillerPlantId
            },
            location: { name: element.locationName, id: element.locationID },
            meterID: element.meterID
          });
        }
      });
      return processedData;
    } catch (e) {
      return null;
    }
  }

  async getHTConfigurationData() {
    try {
      const data = await this.http.get(this.config.endPoints['ht-alert-config'], {
        siteId: this.config.siteConfigurations.siteId
      }).toPromise();
      const processedData = [];
      data.forEach(element => {
        if (this.navigationService.getLoopById(element.htLoopId)[0] && this.navigationService.getSubstationById(element.substationId)[0]) {
          processedData.push({
            toggle: element.status == 1,
            equipment: element.meterName,
            mondayBenchMark: this.thousandSeparator.transform(element.benchmarkDay2),
            tuesdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay3),
            wednesdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay4),
            thursdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay5),
            fridayBenchMark: this.thousandSeparator.transform(element.benchmarkDay6),
            saturdayBenchMark: this.thousandSeparator.transform(element.benchmarkDay7),
            sundayBenchMark: this.thousandSeparator.transform(element.benchmarkDay1),
            changeMode: [
              {key: 'auto', text: 'Auto', selected: element.benchmarkType == BenchMarkType.Auto},
              {key: 'manual', text: 'Manual', selected: element.benchmarkType == BenchMarkType.Manual}
            ],
            loop: {
              name: this.navigationService.getLoopById(element.htLoopId)[0].htLoopName,
              id: element.htLoopId
            },
            substation: {
              name: this.navigationService.getSubstationById(element.substationId)[0].subStationName,
              id: element.substationId
            },
            location: { name: element.locationName, id: element.locationID },
            meterID: element.meterID
          });
        }
      });
      return processedData;
    } catch (e) {
      return null;
    }
  }


  changeConfigurationMode(requestBody) {
    try {
      let data = this.http.post(this.config.endPoints['set-alert-benchmark-type'], requestBody, {}).toPromise();

      return data;
    } catch (e) {
      return null;
    }
  }

  changeAlertConfigStatus(requestBody) {
    try {
      let data = this.http.post(this.config.endPoints['set-alert-config-status'], requestBody, {}).toPromise();

      return data;
    } catch (e) {
      return null;
    }
  }

  updateManualModeConfiguration(requestBody) {
    try {
      let data = this.http.post(this.config.endPoints['set-alert-manual-config-data'], requestBody,{}).toPromise();
      return data;
    } catch (e) {
      return null;
    }
  }

  acknowldgeAlerts(requestBody) {
    try {
      let data = this.http.post(this.config.endPoints['acknowledge-alerts'], requestBody, {}).toPromise();
      return data;
    } catch (e) {
      return null;
    }
  }

  exportAlertsDetails(serviceType: ServiceType, dateRange: DateRange, buildingGroupId?, buildingId?, levelId?, loopId?, substationId?, plantId?) {
    let url = "";
    switch(serviceType){
      case ServiceType.CHILLER:
        url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints["alert-chiller-export"]}`, { 
          from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
          to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
          plantId: plantId
        });
        break;
      case ServiceType.ELECTRICAL:
        url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints["alert-lt-water-export"]}`, { 
          from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
          to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
          buildingGroupId: buildingGroupId,
          buildingId: buildingId,
          levelId: levelId,
          serviceTypeId: serviceType
        });
        break;
      case (ServiceType.HT_ELECTRICAL):
        url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints["alert-ht-export"]}`, { 
          from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
          to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
          loopId: loopId,
          substationId: substationId,
          serviceTypeId: serviceType,
          siteId: 1
        });
        break;
      case (ServiceType.MAIN_HT_ELECTRICAL):
        url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints["alert-ht-export"]}`, { 
          from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
          to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
          loopId: loopId,
          substationId: substationId,
          serviceTypeId: serviceType,
          siteId: 1
        });
        break;
      case (ServiceType.WATER):
        url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints["alert-lt-water-export"]}`, { 
          from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
          to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
          buildingGroupId: buildingGroupId,
          buildingId: buildingId,
          levelId: levelId,
          serviceTypeId: serviceType
        });
        break;
      case (ServiceType.MAIN_WATER):
        url = buildPlaceholder(`${this.initialService.getHost()}/${this.config.endPoints["alert-lt-water-export"]}`, { 
          from: `${this.datePipe.transform(dateRange.start, 'yyyy/MM/dd')} 00:00 AM`,
          to: `${this.datePipe.transform(dateRange.end, 'yyyy/MM/dd')} 00:00 AM`,
          buildingGroupId: buildingGroupId,
          buildingId: buildingId,
          levelId: levelId,
          serviceTypeId: serviceType
        });
        break;
    }
    this.downloadAsExcel(url)
  }

  async downloadAsExcel(url) {
    try {
      let newTab;
      newTab = window.open(url);
      this.notifier.notify('success', 'Report Successfully Downloaded');
    } catch (e) {
      this.notifier.notify('error', 'Failed to Download the Report');
    }
  }
}
