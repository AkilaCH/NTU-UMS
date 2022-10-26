import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnMode, SortType, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NavigationService } from 'src/app/store/navigation.service';
import {getBuildingGroupList, getBuildingList, getLoopList, getPlantList, getSubstationList, getLevelList, getMeterTypeList, getLocationList, getEquipmentTypeList} from '../../../util/filtrationDropdownHelper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HeaderService } from 'src/app/services/header.service';
import { ServiceType } from 'src/enums/ServiceType';

@Component({
  selector: 'app-configuration-table',
  templateUrl: './configuration-table.component.html',
  styleUrls: ['./configuration-table.component.scss']
})
export class ConfigurationTableComponent implements OnInit {

  searchTerm = '';
  configurationForm: FormGroup;

  ColumnMode = ColumnMode;
  SortType = SortType;
  SelectionType = SelectionType;
  tableOffset: number;
  plusIcon = faPlus;
  isEditEnabled = false;
  editableRow: any;
  insertionMethod: string;

  buildingGroupId: number;
  buildingId: number;
  levelId: number;
  locationId: number;
  substationId: number;
  loopId: number;
  plantId: number;
  equipmentTypeId: number;
  equipmentType: number;
  meterTypeId: number;
  meterName: string;
  opcTag: string;
  relationship: string;
  serviceType: ServiceType;
  buttonText: string;

  @Input() rows;
  @Input() type;
  @Input() isLoading: boolean;

  @Output() onSave = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  @Output() onEditOrInsert = new EventEmitter();

  buildings: any = [];
  buildingGroups: any = [];
  levels: any = [];
  substations: any = [];
  loops: any = [];
  plants: any = [];
  equipmentTypes: any = [];
  locations: any = [];
  meterTypes: any = [];
  tableWidth = new BehaviorSubject<any>('100%');

  constructor(private navigationService: NavigationService, private fb: FormBuilder, private headerService: HeaderService) { }

  ngOnInit() {
    if (this.type == 'lt') {
      this.serviceType = ServiceType.ELECTRICAL;
    } else {
      this.serviceType = ServiceType.WATER;
    }
    this.headerService.getChartWidth().subscribe(res => {
      if (this.type == 'lt' || this.type == 'water') {
        this.tableWidth.next(res / 10);
      } else {
        this.tableWidth.next(res / 6);
      }
    });
    if (this.type == 'chiller') {
      this.buttonText = 'Equipment';
    } else {
      this.buttonText = 'Meter';
    }

    this.tableOffset = 0;
    this.navigationService.buildingGroups$.subscribe(() => {
      const buildingGroupsList = this.navigationService.buildingGroupsByServiceType(this.serviceType);
      this.buildingGroups = getBuildingGroupList(buildingGroupsList);
      this.buildingGroupId = this.getZerothPlaceId(this.buildingGroups);
      this.navigationService.buildings$.subscribe(() => {
        let buildingList = this.navigationService.getBuildingsByBuildingGroup(this.buildingGroupId);
        buildingList = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
        this.buildings = getBuildingList(buildingList);
        this.buildingId = this.getZerothPlaceId(this.buildings);
        this.navigationService.levels$.subscribe(() => {
          this.levels = getLevelList(this.navigationService.getLevelsByBuildingId(this.buildingId));
          this.levelId = this.getZerothPlaceId(this.levels);
          this.navigationService.locations$.subscribe(() => {
            this.locations = getLocationList(this.navigationService.getLocationByLevelId(this.levelId));
            this.locationId = this.getZerothPlaceId(this.locations);
            this.setInitialForm();
          });
        });
      });
    });

    this.navigationService.htLoops$.subscribe(res => {
      this.loops = getLoopList(res);
      this.loopId = this.getZerothPlaceId(this.loops);
      this.navigationService.subStations$.subscribe(() => {
        this.substations = getSubstationList(this.navigationService.getSubstationsByLoopId(this.loopId));
        this.substationId = this.getZerothPlaceId(this.substations);
        this.setInitialForm();
      });
    });

    this.navigationService.plants$.subscribe(res => {
      this.plants = getPlantList(res);
      this.plantId = this.getZerothPlaceId(this.plants);
      this.equipmentTypes = getEquipmentTypeList(
        this.navigationService.getPlantById(this.plantId)[0] ? this.navigationService.getPlantById(this.plantId)[0].equipmentTypes : []
        );
      this.equipmentTypeId = this.getZerothPlaceId(this.equipmentTypes);
      this.setInitialForm();
    });

    this.navigationService.meterTypes$.subscribe(res => {
      this.meterTypes = getMeterTypeList(res);
      this.meterTypeId = this.getZerothPlaceId(this.meterTypes);
      this.setInitialForm();
    });
  }

  ngOnChanges() {
    this.isEditEnabled = false;
  }

  getZerothPlaceId(list) {
    if (list.length !== 0) {
      return list[0].id;
    }
  }

  changeBuildingGroup(id) {
    this.buildingGroupId = Number(id);
    let buildingList = this.navigationService.getBuildingsByBuildingGroup(this.buildingGroupId);
    buildingList = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
    this.buildings = getBuildingList(buildingList);
    this.levels = getLevelList(this.navigationService.getLevelsByBuildingId(Number(this.buildingId)));
    this.levelId = this.getZerothPlaceId(this.levels);
    this.locations = getLocationList(this.navigationService.getLocationByLevelId(this.levelId));
    this.locationId = this.getZerothPlaceId(this.locations);
    this.configurationForm.patchValue({
      buildingGroup: this.buildingGroupId,
      building: this.buildingId,
      level: this.levelId,
      location: this.locationId
    });
  }

  changeBuilding(id) {
    this.buildingId = Number(id);
    this.levels = getLevelList(this.navigationService.getLevelsByBuildingId(this.buildingId));
    this.levelId = this.getZerothPlaceId(this.levels);
    this.locations = getLocationList(this.navigationService.getLocationByLevelId(this.levelId));
    this.locationId = this.getZerothPlaceId(this.locations);
    this.configurationForm.patchValue({
      building: this.buildingId,
      level: this.levelId,
      location: this.locationId
    });
  }

  changeLevel(id) {
    this.levelId = Number(id);
    this.locations = getLocationList(this.navigationService.getLocationByLevelId(this.levelId));
    this.locationId = this.getZerothPlaceId(this.locations);
    this.configurationForm.patchValue({
      level: this.levelId,
      location: this.locationId
    });
  }

  changeLocation(id) {
    this.locationId = Number(id);
    this.configurationForm.patchValue({
      location: this.locationId
    });
  }

  changeLoop(id) {
    this.loopId = Number(id);
    this.substations = getSubstationList(this.navigationService.getSubstationsByLoopId(this.loopId));
    this.substationId = this.getZerothPlaceId(this.substations);
    this.configurationForm.patchValue({
      loop: this.loopId,
      substation: this.substationId,
    });
  }

  changePlant(id) {
    this.plantId = Number(id);
    this.equipmentTypes = getEquipmentTypeList(
      this.navigationService.getPlantById(this.plantId)[0] ? this.navigationService.getPlantById(this.plantId)[0].equipmentTypes : []
      );
    this.equipmentTypeId = this.getZerothPlaceId(this.equipmentTypes);
    this.configurationForm.patchValue({
      plant: this.plantId,
      equipmentType: this.equipmentTypeId,
    });
  }

  changeMeterType(id) {
    this.meterTypeId = Number(id);
    this.configurationForm.patchValue({
      meterType: this.meterTypeId
    });
  }

  changeEquipmentType(id) {
    this.equipmentTypeId = Number(id);
    this.configurationForm.patchValue({
      equipmentType: this.equipmentTypeId
    });
  }

  editRowAction(row) {
    this.isEditEnabled = true;
    this.editableRow = Object.assign({}, row);
    row.action = 'update';
    this.insertionMethod = 'edit';
    this.buildingGroupId = row.buildingGroup ? row.buildingGroup.id : null;
    this.changeBuildingGroup(this.buildingGroupId);
    this.buildingId = row.building ? row.building.id : null;
    this.changeBuilding(this.buildingId);
    this.levelId = row.level ? row.level.id : null;
    this.changeLevel(this.levelId);
    this.locationId = row.location ? row.location.id : null;
    this.meterTypeId = row.meterType ? row.meterType.id : null;
    this.loopId = row.loop ? row.loop.id : null;
    this.changeLoop(this.loopId);
    this.substationId = row.substation ? row.substation.id : null;
    this.plantId = row.plant ? row.plant.id : null;
    this.changePlant(this.plantId);
    this.equipmentTypeId = row.equipmentType ? row.equipmentType.id : null;
    this.meterName = row.meter ? row.meter.name : '';
    this.opcTag = row.opcTag ? row.opcTag.name : '';
    this.relationship = row.relationship ? row.relationship.name : '';

    this.setInitialForm();
  }

  deleteRow(event) {
    this.onDelete.emit(event);
  }

  onSaveButtonClicked(event) {
    if (this.insertionMethod == 'edit') {
      this.updateRow(event);
    } else {
      this.saveRow(event);
    }
  }

  saveRow(event){
    this.onSave.emit(this.configurationForm.value);
    this.rows = [...this.rows];
    this.isEditEnabled = false;
  }

  updateRow(event) {
    this.configurationForm.patchValue({
      id: event.meter.id,
      equipment: event.equipment ? event.equipment.id : null
    });
    this.onUpdate.emit(this.configurationForm.value);
    event.action = 'NONE';
    this.rows = [...this.rows];
    this.isEditEnabled = false;
  }

  onPageChange(event: any): void {
    this.tableOffset = event.offset;
  }

  addNewRow(row) {
    this.tableOffset = 0;
    this.insertionMethod = 'insert';
    this.changeBuildingGroup(this.getZerothPlaceId(this.buildingGroups));
    this.changeLoop(this.getZerothPlaceId(this.loops));
    this.changePlant(this.getZerothPlaceId(this.plants));
    this.meterName = '';
    this.opcTag = '';
    this.relationship = '';
    this.setInitialForm();

    this.rows.unshift({
      buildingGroup: {name: '', id: this.buildingGroupId},
      building: {name: '', id: this.buildingId},
      level: {name: '', id: this.levelId},
      location: {name: '', id: this.locationId},
      loop: {name: '', id: this.loopId},
      plant: {name: '', id: this.plantId},
      substation: {name: '', id: this.substationId},
      equipment: {name: '', id: ''},
      meterType: {name: '', id: this.meterTypeId},
      meter: {name: '', id: `${(+new Date).toString(36)}/insert`},
      opcTag: {name: '', id: ''},
      relationship: {name: '', id: ''},
      equipmentType: { name: '', id: this.equipmentTypeId },
      action: 'insert'
    });

    this.rows = [...this.rows];
    this.isEditEnabled = true;
  }

  cancelEditInsertAction(row){
    this.isEditEnabled = false;
    if (this.insertionMethod == 'insert'){
      this.rows.shift();
      this.rows = [...this.rows];
    } else {
      Object.assign(row, this.editableRow);
    }
  }

  setInitialForm() {
    this.configurationForm = this.fb.group({
      id: `${(+new Date).toString(36)}/insert`,
      buildingGroup: this.buildingGroupId,
      building: this.buildingId,
      level: this.levelId,
      location: this.locationId,
      relationShip: this.relationship,
      loop: this.loopId,
      substation: this.substationId,
      plant: this.plantId,
      equipmentType: this.equipmentTypeId,
      equipment: '',
      meterType: this.meterTypeId,
      meterName: [ this.meterName, Validators.required],
      opcTag: [this.opcTag, Validators.required]
    });
    this.configurationForm.get('relationShip').setValidators(this.type == 'lt' || this.type == 'water' ? [Validators.required] : []);
  }
}
