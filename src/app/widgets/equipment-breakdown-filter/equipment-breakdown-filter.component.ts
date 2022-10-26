import { DashboardLevel } from '../../../enums/DashboardLevel';
import { ServiceType } from './../../../enums/ServiceType';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DateRange } from '../date-range-picker/public-api';
import { DateServiceService } from 'src/app/services/date-service.service';
import { InitialService } from 'src/app/services/initial.service';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
@Component({
  selector: 'app-equipment-breakdown-filter',
  templateUrl: './equipment-breakdown-filter.component.html',
  styleUrls: ['./equipment-breakdown-filter.component.scss']
})
export class EqupmentBreakdownFilterComponent implements OnInit {
  @Input() dataSource: any;
  @Input() serviceType: ServiceType;
  @Input() eqBreakDownFilter: DateRange;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onDateRangeChanged: EventEmitter<any> = new EventEmitter();
  levelId:any = 0;
  eqCodeId: any= 0;
  eqTypeId: any = 0;
  block: any = [];
  today: Date;
  levelList:any=[];
  eqCode:any=[];
  eqType:any=[];

constructor(
  private dateService: DateServiceService,
  private initialService: InitialService,

) {
  if(this.initialService.getDemoConfig().isDemo){
    this.today = new Date(this.initialService.getDemoConfig().demoDate);
  } else {
    this.today = new Date();
  }
  this.eqBreakDownFilter = this.dateService.thisMonthUpToNow(this.today);
  this.eqBreakDownFilter.end = this.today;
}
  ngOnChanges(changes: SimpleChanges) {
    try{
    this.levelList = [];
    this.eqCode = [];
    this.eqType = [];
    this.getLevelList();
    this.getEqType();
    this.getEqCode();
    this.initialSelection();
    this.filterDataSet();
  } catch (Exception) {}
  }
  ngOnInit() {
  }


  initialSelection() {
    if (
        this.initialService.equipmentBreakdownStoreService.dashboardLevel === DashboardLevel.BUILDING && this.initialService.equipmentBreakdownStoreService.dashboardType == this.serviceType
    ) {
      this.eqBreakDownFilter = this.initialService.equipmentBreakdownStoreService.dateRange;
      this.levelId = this.initialService.equipmentBreakdownStoreService.level;
      this.eqTypeId = this.initialService.equipmentBreakdownStoreService.equipmentType;
      this.eqCodeId = this.initialService.equipmentBreakdownStoreService.equipmentCode;
    } else {
      this.initialService.equipmentBreakdownStoreService.dashboardType = this.serviceType;
      this.initialService.equipmentBreakdownStoreService.dashboardLevel = DashboardLevel.BUILDING;
      this.initialService.equipmentBreakdownStoreService.dateRange = this.eqBreakDownFilter;
      this.initialService.equipmentBreakdownStoreService.level = this.levelId ;
      this.initialService.equipmentBreakdownStoreService.equipmentType = this.eqTypeId ;
      this.initialService.equipmentBreakdownStoreService.equipmentCode = this.eqCodeId ;
    }
  }

  onDateRangeChange() {
    this.initialService.equipmentBreakdownStoreService.dateRange = this.eqBreakDownFilter;
    this.onDateRangeChanged.emit(this.eqBreakDownFilter);
  }

  onLevelChange(e) {
    this.levelId = e.value;
    this.initialService.equipmentBreakdownStoreService.level = e.value;
    this.filterDataSet();
  }

  onEquipmentTypeChange(e) {
    this.eqTypeId = e.value;
    this.initialService.equipmentBreakdownStoreService.equipmentType = e.value;

    this.filterDataSet();
  }

  onEquipmentCode(e) {
    this.eqCodeId = e.value;
    this.initialService.equipmentBreakdownStoreService.equipmentCode = e.value;
    this.filterDataSet();
  }

  filterDataSet() {
    let filteredData = [...this.dataSource];
    if(this.levelId != 0){
      filteredData = filter(filteredData,{'level':{'id': parseInt(this.levelId+"")}});
    }
    if (this.eqCodeId != 0){
      filteredData = filter(filteredData,{'eqCode':{'name':this.eqCodeId}});
    }
    if(this.eqTypeId != 0){
      filteredData = filter(filteredData,{'eqType':{'id': parseInt(this.eqTypeId+"")}});
    }
   this.onFilter.emit(filteredData);

  }

  getLevelList() {
    this.block = [...new Set(this.dataSource.map(item => item.level.name))];
    for (const item of this.block) {
      for (const newItem of this.dataSource) {
        if ( newItem.level.name === item) {
          this.levelList.push({name: newItem.level.name, id: newItem.level.id});
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
    this.eqType = orderBy(this.eqType, ['name'], ['asc']);
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
