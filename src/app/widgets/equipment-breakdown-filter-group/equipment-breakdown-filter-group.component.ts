import { ServiceType } from './../../../enums/ServiceType';
import { DashboardLevel } from 'src/enums/DashboardLevel';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { DateServiceService } from 'src/app/services/date-service.service';
import { InitialService } from 'src/app/services/initial.service';
import { DateRange } from '../date-range-picker/public-api';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

@Component({
  selector: 'app-equipment-breakdown-filter-group',
  templateUrl: './equipment-breakdown-filter-group.component.html',
  styleUrls: ['./equipment-breakdown-filter-group.component.scss']
})
export class EquipmentBreakdownFilterGroupComponent implements OnInit {
  @Input() dataSource: any = [];
  @Input() serviceType: ServiceType;
  @Input() eqBreakDownFilterGroup: DateRange;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onDateRangeChanged: EventEmitter<any> = new EventEmitter();
  block: any = [];
  today: Date;
  blockId: any = 0;
  levelId: any = 0;
  eqCodeId: any = 0;
  eqTypeId: any = 0;
  blockList: any = [];
  levelList: any = [];
  eqCode: any = [];
  eqType: any = [];

  constructor(
    private dateService: DateServiceService,
    private initialService: InitialService
  ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
    this.eqBreakDownFilterGroup = this.dateService.thisMonthUpToNow(this.today);
    this.eqBreakDownFilterGroup.end = this.today;
    }
    ngOnChanges(changes: SimpleChanges) {
      try {
        this.blockList = [];
        this.levelList = [];
        this.eqCode = [];
        this.eqType = [];
        this.getBlocklList();
        this.getLevelList();
        this.getEqType();
        this.getEqCode();
        this.initialSelection();
        this.filterDataSet();
      } catch (Exception) {}
    }

  ngOnInit() {}

  initialSelection() {
    if (
        this.initialService.equipmentBreakdownStoreService.dashboardLevel === DashboardLevel.BUILDING && this.initialService.equipmentBreakdownStoreService.dashboardType == this.serviceType
    ) {
      this.eqBreakDownFilterGroup = this.initialService.equipmentBreakdownStoreService.dateRange;
      this.levelId = this.initialService.equipmentBreakdownStoreService.level;
      this.eqTypeId = this.initialService.equipmentBreakdownStoreService.equipmentType;
      this.eqCodeId = this.initialService.equipmentBreakdownStoreService.equipmentCode;
      this.blockId = this.initialService.equipmentBreakdownStoreService.block;
    } else {
      this.initialService.equipmentBreakdownStoreService.dashboardType = this.serviceType;
      this.initialService.equipmentBreakdownStoreService.dashboardLevel = DashboardLevel.BUILDING;
      this.initialService.equipmentBreakdownStoreService.dateRange = this.eqBreakDownFilterGroup;
      this.initialService.equipmentBreakdownStoreService.level = this.levelId ;
      this.initialService.equipmentBreakdownStoreService.equipmentType = this.eqTypeId ;
      this.initialService.equipmentBreakdownStoreService.equipmentCode = this.eqCodeId ;
      this.initialService.equipmentBreakdownStoreService.block = this.blockId;
    }
  }

  onDateRangeChange(){
    this.initialService.equipmentBreakdownStoreService.dateRange = this.eqBreakDownFilterGroup;
    this.onDateRangeChanged.emit(this.eqBreakDownFilterGroup);
  }

  onBlockChange(e){
    this.blockId = e.value;
    this.initialService.equipmentBreakdownStoreService.block = this.blockId;
    this.filterDataSet();
  }

  onLevelChange(e) {
    this.levelId = e.value;
    this.initialService.equipmentBreakdownStoreService.level = this.levelId ;
    this.filterDataSet();
  }

  onEquipmentTypeChange(e) {
    this.eqTypeId = e.value;
    this.initialService.equipmentBreakdownStoreService.equipmentType = this.eqTypeId ;
    this.filterDataSet();
  }

  onEquipmentCode(e) {
    this.eqCodeId = e.value;
    this.initialService.equipmentBreakdownStoreService.equipmentCode = this.eqCodeId ;
    this.filterDataSet();
  }

  filterDataSet() {
    let filteredData = [...this.dataSource];
    if (this.blockId != 0) {
      filteredData = filter(filteredData, {block: {id: parseInt(this.blockId + '')}});
    }
    if (this.levelId != 0) {
      filteredData = filter(filteredData, {level: {name: this.levelId}});
    }
    if (this.eqCodeId != 0) {
      filteredData = filter(filteredData, {eqCode: {name: this.eqCodeId }});
    }
    if (this.eqTypeId != 0) {
      filteredData = filter(filteredData, {eqType: {id: parseInt(this.eqTypeId + '')}});
    }
    this.onFilter.emit(filteredData);
  }

  getBlocklList() {
    this.block = [...new Set(this.dataSource.map(item => item.block.name))];
    for (const item of this.block) {
      for (const newItem of this.dataSource) {
        if ( newItem.block.name === item) {
          this.blockList.push({name: newItem.block.name, id: newItem.block.id});
          break;
        }
      }
    }
    this.blockList = orderBy(this.blockList, ['name'], ['asc']);
  }
  getLevelList() {
    this.block = [...new Set(this.dataSource.map(item => item.level.name))];
    for (const item of this.block) {
      for (const newItem of this.dataSource) {
        if ( newItem.level.name === item) {
          this.levelList.push({name: newItem.level.name, id: newItem.level.name});
          break;
        }
      }
    }
    this.levelList = orderBy(this.levelList, ['name'], ['asc']);
  }
  getEqType() {
    this.block = [...new Set(this.dataSource.map(item => item.eqType.name))];
    for (const item of this.block) {
      for (const newItem of this.dataSource) {
        if ( newItem.eqType.name === item) {
          this.eqType.push({name: newItem.eqType.name, id: newItem.eqType.id});
          break;
        }
      }
    }

    this.eqType = orderBy(this.eqType, ['name']);
  }
  getEqCode() {
    this.block = [...new Set(this.dataSource.map(item => item.eqCode.name))];
    for (const item of this.block) {
      for (const newItem of this.dataSource) {
        if ( newItem.eqCode.name === item) {
          this.eqCode.push({name: newItem.eqCode.name, id: newItem.eqCode.name});
          break;
        }
      }
    }
    this.eqCode = orderBy(this.eqCode, ['name'], ['asc']);
  }

}
