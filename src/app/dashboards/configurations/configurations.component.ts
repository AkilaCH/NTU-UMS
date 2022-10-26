import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { ConfigurationDashboardService } from 'src/app/services/dashboards/configuration-dashboard.service';
import { ServiceType } from 'src/enums/ServiceType';
import { InitialService } from 'src/app/services/initial.service';
import { NotifierService } from 'angular-notifier';
import findIndex from 'lodash/findIndex';
import { NavigationService } from 'src/app/store/navigation.service';
import { HttpService } from 'src/app/services/http.service';
import { Location } from 'src/app/models/location.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationBoxComponent } from 'src/app/widgets/confirmation-box/confirmation-box.component';


@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  tabIndex: number;
  filteredData: any;
  searchTerm: string;
  disableFiltration = false;

  isLoading: boolean;

  selectedServiceType: ServiceType;
  selectedBuildingGroup: number;
  selectedBuilding: number;
  selectedLoop: number;
  selectedPlant: number;

  ltDataSource = [];
  waterDataSource = [];
  htDataSource = [];
  chillerDataSource = [];

  constructor(
    private headerService: HeaderService,
    private initialService: InitialService,
    private configurationDataService: ConfigurationDashboardService,
    private notifierService: NotifierService,
    private httpService: HttpService,
    public navigationStore: NavigationService,
    private configs: InitialService,
    private modalService: NgbModal
    ) {

    this.tabIndex = 0;
    this.selectedPlant = 0;
    this.selectedLoop = 0;
    this.selectedServiceType = ServiceType.ELECTRICAL;
    this.fetchLtWaterData(ServiceType.ELECTRICAL, 0, 0);
  }

  ngOnInit() {
    this.headerService.setItem('Configurations');
    this.headerService.setBoardLevel(2);
    this.getAllLocations();
  }

  private getAllLocations() {
    this.initialService.navigationStore.locations$.subscribe(res => {
      if (res.length == 0) {
        this.httpService.get(this.configs.endPoints['level-locations'], {levelId: 0}).subscribe((res: Location[]) => {
          this.navigationStore.locations = res;
        });
      }
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = Number(index);
    switch (this.tabIndex) {
      case 0:
        this.selectedBuildingGroup = 0;
        this.selectedBuilding = 0;
        this.selectedServiceType = ServiceType.ELECTRICAL;
        this.fetchLtWaterData(this.selectedServiceType, this.selectedBuildingGroup, this.selectedBuilding);
        break;

      case 1:
        this.selectedLoop = 0;
        this.selectedServiceType = ServiceType.HT_ELECTRICAL;
        this.fetchHtData();
        break;

      case 2:
        this.selectedBuildingGroup = 0;
        this.selectedBuilding = 0;
        this.selectedServiceType = ServiceType.WATER;
        this.fetchLtWaterData(this.selectedServiceType, this.selectedBuildingGroup, this.selectedBuilding);
        break;

      case 3:
        this.selectedPlant = 0;
        this.selectedServiceType = ServiceType.CHILLER;
        this.fetchChillerData();
        break;

      default:
        this.selectedBuildingGroup = 0;
        this.selectedBuilding = 0;
        this.selectedServiceType = ServiceType.ELECTRICAL;
        this.fetchLtWaterData(this.selectedServiceType, this.selectedBuildingGroup, this.selectedBuilding);
        break;
    }
  }

  onChangeBuildingGroup(event) {
    this.selectedBuildingGroup = Number(event);
    this.selectedBuilding = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.selectedBuildingGroup)[0] ?
      this.initialService.navigationStore.getBuildingsByBuildingGroup(this.selectedBuildingGroup)[0].buildingID : 0;
    this.fetchLtWaterData(this.selectedServiceType, this.selectedBuildingGroup, this.selectedBuilding);
  }

  onChangeBuilding(event) {
    this.selectedBuilding = Number(event);
    this.fetchLtWaterData(this.selectedServiceType, this.selectedBuildingGroup, this.selectedBuilding);
  }

  onChangeLoop(event) {
    this.selectedLoop = Number(event);
    this.fetchHtData();
  }

  onChangePlant(event) {
    this.selectedPlant = Number(event);
    this.fetchChillerData();
  }

  fetchLtWaterData(serviceType, buildingGroupId, buildingId) {
    this.isLoading = true;
    if (buildingGroupId == 0) {
      buildingId = 0;
    }
    this.configurationDataService.getLtWaterMeters(serviceType, buildingGroupId, buildingId).then(res => {
      switch (serviceType) {
        case ServiceType.ELECTRICAL:
          this.ltDataSource = res;
          break;
        case ServiceType.WATER :
          this.waterDataSource = res;
          break;
        case ServiceType.MAIN_WATER:
          this.waterDataSource = res;
          break;
      }
      this.isLoading = false;
    });
  }

  fetchHtData() {
    this.isLoading = true;
    this.configurationDataService.getHtMeters(this.selectedLoop).then(res => {
      this.htDataSource = res;
      this.isLoading = false;
    });
  }

  fetchChillerData() {
    this.isLoading = true;
    this.configurationDataService.getChillerMeters(this.selectedPlant).then(res => {
      this.chillerDataSource = res;
      this.isLoading = false;
    });
  }

  onDataFiltered(event) {
    this.filteredData = [];
    event.forEach(element => {
      element['action'] = '';
      this.filteredData.push(element);
    });
  }

  onSaveNewMeter(data) {
    let body = {
      meterName: data.meterName,
      OPCTag: data.opcTag
    };
    switch (this.tabIndex) {
      case 0:
        body['LocationId'] = data.location;
        body['meterTypeId'] = data.meterType;
        body['MeterRelationship'] = data.relationShip;
        this.configurationDataService.addLtWaterMeters(this.selectedServiceType, body).then(res => {
          if (res.StatusCode == 201 && res.Message == 'Created') {
            this.filteredData.unshift({
              action: '',
              buildingGroup: {id: data.buildingGroup, name: this.navigationStore.getBuildingGroupById(Number(data.buildingGroup))[0].description},
              building: {id: data.building, name: this.navigationStore.getBuilding(Number(data.building))[0].buildingName},
              level: {id: data.level, name: this.navigationStore.getLevelById(Number(data.level))[0].floorName},
              location: {id: data.location, name: this.navigationStore.getLocationById(Number(data.location))[0].locationName},
              meter: {id: res.Data.meterID, name: data.meterName},
              meterType: {id: data.meterType, name: this.navigationStore.getMeterTypeById(Number(data.meterType))[0].description},
              relationship: {id: null, name: data.relationShip},
              opcTag: {id: null, name: data.opcTag}
            });
            let index = findIndex(this.filteredData, {action: 'insert'});
            this.filteredData.splice(index, 1);
            this.filteredData = [...this.filteredData];
            this.notifierService.notify('success', 'Meter Successfully Added');
          } else {
            this.notifierService.notify('error', 'Failed to Add Meter');
          }
        });
        break;

      case 1:
        body['subStationId'] = data.substation;
        body['htLoopId'] = data.loop;
        this.configurationDataService.addHtMeters(body).then(res => {
          if (res.StatusCode == 201 && res.Message == 'Created') {
            this.filteredData.unshift({
              action: '',
              meter: {id: res.Data.meterID, name: data.meterName},
              loop: {id: data.loop, name: this.navigationStore.getLoopById(Number(data.loop))[0].htLoopName},
              substation: {id: data.substation, name: this.navigationStore.getSubstationById(Number(data.substation))[0].subStationName},
              opcTag: {id: null, name: data.opcTag}
            });
            let index = findIndex(this.filteredData, {action: 'insert'});
            this.filteredData.splice(index, 1);
            this.filteredData = [...this.filteredData];
            this.notifierService.notify('success', 'Meter Successfully Added');
          } else {
            this.notifierService.notify('error', 'Failed to Add Meter');
          }
        });
        break;

      case 2:
        body['LocationId'] = data.location;
        body['meterTypeId'] = data.meterType;
        body['MeterRelationship'] = data.relationShip;
        this.configurationDataService.addLtWaterMeters(this.selectedServiceType, body).then(res => {
          if (res.StatusCode == 201 && res.Message == 'Created') {
            this.filteredData.unshift({
              action: '',
              buildingGroup: {id: data.buildingGroup, name: this.navigationStore.getBuildingGroupById(Number(data.buildingGroup))[0].description},
              building: {id: data.building, name: this.navigationStore.getBuilding(Number(data.building))[0].buildingName},
              level: {id: data.level, name: this.navigationStore.getLevelById(Number(data.level))[0].floorName},
              location: {id: data.location, name: this.navigationStore.getLocationById(Number(data.location))[0].locationName},
              meter: {id: res.Data.meterID, name: data.meterName},
              meterType: {id: data.meterType, name: this.navigationStore.getMeterTypeById(Number(data.meterType))[0].description},
              relationship: {id: null, name: data.relationShip},
              opcTag: {id: null, name: data.opcTag}
            });
            let index = findIndex(this.filteredData, {action: 'insert'});
            this.filteredData.splice(index, 1);
            this.filteredData = [...this.filteredData];
            this.notifierService.notify('success', 'Meter Successfully Added');
          } else {
            this.notifierService.notify('error', 'Failed to Add Meter');
          }
        });
        break;

      case 3:
        body['equipmentTypeId'] = data.equipmentType;
        this.configurationDataService.addChillerMeters(data.plant, body).then(res => {
          if (res.StatusCode == 201 && res.Message == 'Created') {
            this.filteredData.unshift({
              action: '',
              plant: {id: data.plant, name: this.navigationStore.getPlantById(Number(data.plant))[0].name},
              equipmentType: {id: data.equipmentType, name: this.navigationStore.getEquipmentTypeById(Number(data.equipmentType), Number(data.plant))[0].name},
              equipment: {id: res.Data.equipmentID, name: null},
              meter: {id: res.Data.meterID, name: data.meterName},
              opcTag: {id: null, name: data.opcTag}
            });
            let index = findIndex(this.filteredData, {action: 'insert'});
            this.filteredData.splice(index, 1);
            this.filteredData = [...this.filteredData];
            this.notifierService.notify('success', 'Meter Successfully Added');
          } else {
            this.notifierService.notify('error', 'Failed to Add Meter');
          }
        });
        break;
    }
  }

  onUpdateMeter(data) {
    const index = findIndex(this.filteredData, (item: any) => {
      return `${data.id}` == `${item.meter.id}`;
    });
    let body = {
      OPCTag: data.opcTag,
      meterName: data.meterName,
      meterId: data.id
    };
    switch (this.tabIndex) {
      case 0:
        body['LocationId'] = data.location;
        body['meterTypeId'] = data.meterType;
        body['MeterRelationship'] = data.relationShip;
        this.configurationDataService.updateLtWaterMeters(ServiceType.ELECTRICAL, body).then((res: any) => {
          if (res.StatusCode == 200 && res.Message == 'Success') {
            this.filteredData[index].meter.id = data.id;
            this.filteredData[index].buildingGroup.id = Number(data.buildingGroup);
            this.filteredData[index].buildingGroup.name = this.navigationStore.getBuildingGroupById(Number(data.buildingGroup))[0].description;
            this.filteredData[index].building.id = data.building;
            this.filteredData[index].building.name = this.navigationStore.getBuilding(Number(data.building))[0].buildingName;
            this.filteredData[index].level.id = data.level;
            this.filteredData[index].level.name = this.navigationStore.getLevelById(Number(data.level))[0].floorName;
            this.filteredData[index].location.id = data.location;
            this.filteredData[index].location.name = this.navigationStore.getLocationById(Number(data.location))[0].locationName;
            this.filteredData[index].meterType.id = data.meterType;
            this.filteredData[index].meterType.name = this.navigationStore.getMeterTypeById(Number(data.meterType))[0].description;
            this.filteredData[index].meter.name = data.meterName;
            this.filteredData[index].opcTag.name = data.opcTag;
            this.filteredData[index].relationship.name = data.relationShip;
            this.notifierService.notify('success', 'Meter Successfully Updated');
          } else {
            this.notifierService.notify('error', 'Failed to Update Meter');
          }
        });
        break;

      case 1:
        this.configurationDataService.updateHtMeters(body).then((res: any) => {
          if (res.StatusCode == 200 && res.Message == 'Success') {
            this.filteredData[index].loop.id = Number(data.loop);
            this.filteredData[index].loop.name = this.navigationStore.getLoopById(Number(data.loop))[0].htLoopName;
            this.filteredData[index].opcTag.name = data.opcTag;
            this.filteredData[index].meter.id = data.id;
            this.filteredData[index].substation.id = data.substation;
            this.filteredData[index].substation.name = this.navigationStore.getSubstationById(Number(data.substation))[0].subStationName;
            this.filteredData[index].meter.name = data.meterName;
            this.notifierService.notify('success', 'Meter Successfully Updated');
          } else {
            this.notifierService.notify('error', 'Failed to Update Meter');
          }
        });
        break;

      case 2:
        body['LocationId'] = data.location;
        body['meterTypeId'] = data.meterType;
        body['MeterRelationship'] = data.relationShip;
        this.configurationDataService.updateLtWaterMeters(ServiceType.WATER, body).then((res: any) => {
          if (res.StatusCode == 200 && res.Message == 'Success') {
            this.filteredData[index].meter.id = data.id;
            this.filteredData[index].buildingGroup.id = Number(data.buildingGroup);
            this.filteredData[index].buildingGroup.name = this.navigationStore.getBuildingGroupById(Number(data.buildingGroup))[0].description;
            this.filteredData[index].building.id = data.building;
            this.filteredData[index].building.name = this.navigationStore.getBuilding(Number(data.building))[0].buildingName;
            this.filteredData[index].level.id = data.level;
            this.filteredData[index].level.name = this.navigationStore.getLevelById(Number(data.level))[0].floorName;
            this.filteredData[index].location.id = data.location;
            this.filteredData[index].location.name = this.navigationStore.getLocationById(Number(data.location))[0].locationName;
            this.filteredData[index].meterType.id = data.meterType;
            this.filteredData[index].meterType.name = this.navigationStore.getMeterTypeById(Number(data.meterType))[0].description;
            this.filteredData[index].meter.name = data.meterName;
            this.filteredData[index].opcTag.name = data.opcTag;
            this.filteredData[index].relationship.name = data.relationShip;
            this.notifierService.notify('success', 'Meter Successfully Updated');
          } else {
            this.notifierService.notify('error', 'Failed to Update Meter');
          }
        });
        break;

      case 3:
        body['EquipmentID'] = data.equipment;
        body['equipmentTypeId'] = data.equipmentType;
        this.configurationDataService.updateChillerMeters(data.plant, body).then((res: any) => {
          if (res.StatusCode == 200 && res.Message == 'Success') {
            this.filteredData[index].plant.id = data.plant;
            this.filteredData[index].plant.name = this.navigationStore.getPlantById(Number(data.plant))[0].name;
            this.filteredData[index].equipmentType.id = data.equipmentType;
            this.filteredData[index].equipmentType.name = this.navigationStore.getEquipmentTypeById(Number(data.equipmentType), Number(data.plant))[0].name;
            this.filteredData[index].meter.name = data.meterName;
            this.filteredData[index].opcTag.name = data.opcTag;
            this.notifierService.notify('success', 'Meter Successfully Updated');
          } else {
            this.notifierService.notify('error', 'Failed to Update Meter');
          }
        });
        break;
    }
  }

  onDeleteMeter(event) {
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Are you sure you want to delete this Meter?';
    modalRef.result.then((result) => {
      if (result == 'Cross click') {
        let deleteBody = [{
          MeterId: event.meter.id,
          status: 3
        }];
        this.configurationDataService.deleteMeter(deleteBody, this.selectedServiceType).then((res: any)=>{
          try {
            if (res.Message === 'Success') {
              let index = findIndex(this.filteredData, {meter: {id: event.meter.id}});
              this.filteredData.splice(index, 1);
              this.notifierService.notify('success', 'Meter Successfully Deleted');
              this.filteredData = [...this.filteredData];
            }
          } catch (e) {
            this.notifierService.notify('error', 'Failed to Delete Meter');
          }
        });
      }
    }, error => { });
  }

  onEditOrInsert(event) {
    this.disableFiltration = event;
  }

}

