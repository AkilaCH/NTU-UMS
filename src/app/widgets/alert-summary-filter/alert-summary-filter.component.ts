import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import filter from 'lodash/filter';
import { NavigationService } from 'src/app/store/navigation.service';
import {getBuildingGroupList, getBuildingList, getLoopList, getPlantList, getSubstationList, getLevelList} from '../../../util/filtrationDropdownHelper';
import { InitialService } from 'src/app/services/initial.service';
import { ServiceType } from 'src/enums/ServiceType';

@Component({
  selector: 'app-alert-summary-filter',
  templateUrl: './alert-summary-filter.component.html',
  styleUrls: ['./alert-summary-filter.component.scss']
})
export class AlertSummaryFilterComponent implements OnInit {

  @Input() type;
  @Input() tabType = 'summary';
  @Input() dataSource;
  @Input() filterFields;
  @Input() disabled=false;
  @Input() filterData = true;
  @Input() showActive = true;
  @Output() onFilter = new EventEmitter();
  @Output() filterFieldsChange = new EventEmitter();
  @Output() selectedBuildingGroup = new EventEmitter();
  @Output() selectedBuilding = new EventEmitter();
  @Output() selectedLoop = new EventEmitter();
  @Output() selectedPlant = new EventEmitter();

  buildings: any = [];
  buildingGroups: any = [];
  levels: any = [];
  substations: any = [];
  loops: any = [];
  plants: any = [];
  activates: any = [
    {
      name: 'Activated',
      id: 'true'
    },
    {
      name: 'Deactivated',
      id: 'false'
    }
  ];

  status: any = [{
    name: 'Pending',
    id: 'Pending'
  }, {
    name: 'Acknowledged',
    id: 'Acknowledged'
  }];

  buildingGroupId: any = 0;
  buildingId: any = 0;
  levelId: any = 0;
  substationId: any = 0;
  loopId: any = 0;
  plantId: any = 0;
  statusId: any = 0;
  activateId: any = 0;
  serviceType: ServiceType;

  constructor(private navigationService: NavigationService, private initialService: InitialService) { }

  ngOnInit() {
    if (this.type == 'lt') {
      this.serviceType = ServiceType.ELECTRICAL;
    } else {
      this.serviceType = ServiceType.WATER;
    }
    this.navigationService.buildingGroups$.subscribe(() => {
      this.buildingGroups = getBuildingGroupList(
        this.initialService.navigationStore.buildingGroupsByServiceType(this.serviceType)
      );
    });

    this.navigationService.buildings$.subscribe(res=>{
      this.buildings = getBuildingList(
        this.initialService.navigationStore.buildingsByServiceType(this.serviceType)
      );
    });

    this.navigationService.htLoops$.subscribe(res=>{
      this.loops = getLoopList(res);
    });

    this.navigationService.plants$.subscribe(res=>{
      this.plants = getPlantList(res);
    });

    this.navigationService.subStations$.subscribe(res=>{
      this.substations = getSubstationList(res);
    });

    this.navigationService.levels$.subscribe(res=>{
      this.levels = getLevelList(res);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    try { this.filterDataSet(); } catch { }
  }


  /**
   * Determines whether building group change on
   * @param e 
   */
  onBuildingGroupChange(e) {
    this.buildingGroupId = e.value;
    this.buildingId = 0;
    this.levelId = 0;
    if (this.buildingGroupId != 0) {
      let buildingList = this.navigationService.getBuildingsByBuildingGroup(Number(this.buildingGroupId));
      buildingList = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
      this.buildings = getBuildingList(buildingList);

    } else {
      let buildingList = this.navigationService.buildings;
      buildingList = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
      this.buildings = getBuildingList(buildingList);
    }
    this.selectedBuildingGroup.emit(e.value);
    this.filterDataSet();
    this.emitFilterData();
  }


  /**
   * Determines whether building change on
   * @param e 
   */
  onBuildingChange(e) {
    this.buildingId = e.value;
    this.levelId = 0;
    if(this.buildingId!=0){
      this.levels = getLevelList(this.navigationService.getLevelsByBuildingId(parseInt(this.buildingId)));
    }else{
      this.levels = getLevelList(this.navigationService.levels);
    }
    this.selectedBuilding.emit(e.value);
    this.filterDataSet();
    this.emitFilterData();
  }


  /**
   * Determines whether level change on
   * @param e 
   */
  onLevelChange(e) {
    this.levelId = e.value;
    this.filterDataSet();
    this.emitFilterData();
  }


  /**
   * Determines whether substation change on
   * @param e 
   */
  onSubstationChange(e) {
    this.substationId = e.value;
    this.filterDataSet();
    this.emitFilterData();
  }


  /**
   * Determines whether loop change on
   * @param e 
   */
  onLoopChange(e) {
    this.loopId = e.value;
    this.substationId = 0;
    if(this.loopId!=0){
      this.substations = getSubstationList(this.navigationService.getSubstationsByLoopId(parseInt(this.loopId)));
    }else{
      this.substations = getSubstationList(this.navigationService.subStations);
    }
    this.selectedLoop.emit(e.value);
    this.filterDataSet();
    this.emitFilterData();
  }


  /**
   * Determines whether plant change on
   * @param e 
   */
  onPlantChange(e) {
    this.plantId = e.value;
    this.selectedPlant.emit(e.value);
    this.filterDataSet();
    this.emitFilterData();
  }

   /**
   * Determines whether status change on
   * @param e 
   */
  onStatusChange(e){
    this.statusId = e.value;
    this.filterDataSet();
  }

  onActivateChange(e){
    this.activateId = e.value;
    this.filterDataSet();
  }



  /**
   * Filters data set
   */
  filterDataSet() {
    let filteredData = [...this.dataSource];

    if (this.filterData) {
      if (this.buildingGroupId != 0) {
        filteredData = filter(filteredData, { 'buildingGroup': { 'id': parseInt(this.buildingGroupId + '') } });
      }

      if (this.buildingId != 0) {
        filteredData = filter(filteredData, { 'building': { 'id': parseInt(this.buildingId + '') } });
      }

      if (this.loopId != 0) {
        filteredData = filter(filteredData, { 'loop': { 'id': parseInt(this.loopId + '') } });
      }

      if (this.plantId != 0) {
        filteredData = filter(filteredData, { 'plant': { 'id': parseInt(this.plantId + '') } });
      }
    }

    if (this.levelId != 0) {
      filteredData = filter(filteredData, { 'level': { 'id': parseInt(this.levelId + '') } });
    }

    if (this.substationId != 0) {
      filteredData = filter(filteredData, { 'substation': { 'id': parseInt(this.substationId + '') } });
    }

    if (this.statusId != 0) {
      filteredData = filter(filteredData, { 'status': { 'name': this.statusId } });
    }

    if (this.activateId != 0) {
      filteredData = filter(filteredData, { 'toggle': this.activateId=='true'?true:false });
    }

    this.onFilter.emit(filteredData);
  }

  emitFilterData(){
    this.filterFieldsChange.emit({
      buildingGroupId: this.buildingGroupId,
      buildingId: this.buildingId,
      levelId: this.levelId,
      substationId: this.substationId,
      loopId: this.loopId,
      plantId: this.plantId
    });
  }
}
