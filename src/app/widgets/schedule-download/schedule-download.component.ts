import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DateRange } from './../date-range-picker/lib/models/date-range';
import { BuildingLevelType} from '../../../enums/building-level-type.enum';
import { ServiceType } from '../../../enums/service-type.enum';
import { ColumnMode, SortType, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import uniqueBy from 'lodash/unionBy';
import cloneDeep from 'lodash/cloneDeep';
import { DatePipe } from '@angular/common';
import { InitialService } from 'src/app/services/initial.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationType } from 'src/enums/location-type.enum';
import { ConfirmationBoxComponent } from 'src/app/widgets/confirmation-box/confirmation-box.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/app/services/header.service';
import { BehaviorSubject } from 'rxjs';
import sortBy from 'lodash/sortBy';


@Component({
  selector: 'app-schedule-download',
  templateUrl: './schedule-download.component.html',
  styleUrls: ['./schedule-download.component.scss']
})
export class ScheduleDownloadComponent implements OnInit {

  scheduleForm: FormGroup;

  today: Date;
  buildingLevelType: BuildingLevelType;
  sites = [];
  buildingGroups = [];
  buildings = [];
  selectedLocation: LocationType;
  selectedSite: any;
  selectedBuildingGroup: any;
  selectedBuilding: any;
  returnData: any;
  tableWidth = new BehaviorSubject<any>('100%');
  searchTerm = '';

  loadingIndicator = true;

  ColumnMode = ColumnMode;
  SortType = SortType;
  SelectionType = SelectionType;
  dateRange: DateRange = new DateRange(new Date(), new Date());

  plusIcon = faPlus;
  selected = [];
  editRows: any = [];
  disabledAddEdit: boolean;

  @Input() isLoading;
  @Input() serviceType;
  @Input() rows: any[];
  @Output() locationType = new EventEmitter();
  @Output() insertData = new EventEmitter();
  @Output() updateData = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private headerService: HeaderService,
    private datePipe: DatePipe,
    private initialService: InitialService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
  }

  ngOnInit() {
    this.initialService.navigationStore.sites$.subscribe(res => {
      this.sites = res;
      this.selectedSite = res[0].siteID;
    });
    this.initialService.navigationStore.buildingGroups$.subscribe(() => {
      this.buildingGroups = this.initialService.navigationStore.buildingGroupsByServiceType(this.serviceType);
      this.buildingGroups = sortBy(this.buildingGroups, ['description']);
      this.selectedBuildingGroup = this.buildingGroups[0].buildingGroupID;
      this.initialService.navigationStore.buildings$.subscribe(() => {
        const buildingList = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.selectedBuildingGroup);
        this.buildings = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
        this.buildings = sortBy(this.buildings, ['buildingName']);
        this.selectedBuilding = this.buildings[0].buildingID;
      });
    });

    this.changeLocationType(LocationType.Site);
    this.setInitialForm();

    this.disabledAddEdit = false;
  }

  ngOnChanges() {

  }

  changeLocationType(locationType) {
    this.searchTerm = '';
    this.headerService.getChartWidth().subscribe(res => {
      switch (Number(locationType)) {
        case LocationType.Site:
          this.tableWidth.next(res / 6);
          break;
        case LocationType.BuildingGroup:
          this.tableWidth.next(res / 7);
          break;
        case LocationType.Building:
          this.tableWidth.next(res / 8);
          break;
        default:
          this.tableWidth.next(res / 6);
          break;
      }
    });
    this.selectedLocation = parseInt(locationType);
    this.locationType.emit(parseInt(locationType));
    this.disabledAddEdit = false;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  addNewRow() {
    this.searchTerm = '';
    this.disabledAddEdit = true;
    this.setInitialForm();
    this.table.offset = 0;
    let row = {
      id: `${(+new Date).toString(36)}/insert`,
      scheduleName: null,
      reportType: 'Daily',
      site: {
        id: this.sites[0].siteID,
        name: this.sites[0].siteName
      },
      buildingGroup: {
        id: this.buildingGroups[0].buildingGroupID,
        name: this.buildingGroups[0].description
      },
      building: {
        id: this.buildings[0].buildingID,
        name: this.buildings[0].buildingName
      },
      startDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      status: 'ACTIVE',
      action: 'insert'
    };
    this.rows.unshift(
      row
    );
    this.rows = [...this.rows];
  }

  changeScheduleName(row, event) {
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    if (event.target.value == null || event.target.value === '') {
      event.target.style.borderColor = 'red';
    }
    row.scheduleName = event.target.value;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  changeReportType(row, event) {
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    row.reportType = event.target.value;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  changeSite(row, id) {
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    row.site = id;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  changeBuildingGroup(row, id) {
    this.selectedBuildingGroup = parseInt(id);
    const buildingList = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.selectedBuildingGroup);
    this.buildings = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
    this.buildings = sortBy(this.buildings, ['buildingName']);
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    row.buildingGroup = this.buildingGroups.find(x => x.buildingGroupID == id).description;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  changeBuilding(row, id) {
    this.selectedBuilding = id;
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    row.building = this.buildings.find(x => x.buildingID == id).buildingName;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  changeStartingTime(row, event) {
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    row.startDate = event.target.value;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  changeStatus(row, event) {
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    row.status = event.target.value;
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  editRowAction(row) {
    this.disabledAddEdit = true;
    const buildingList = this.initialService.navigationStore.getBuildingsByBuildingGroup(Number(row.buildingGroup.id));
    this.buildings = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
    this.buildings = sortBy(this.buildings, ['buildingName']);
    this.scheduleForm.patchValue({
      id: row.id,
      scheduleName: row.scheduleName,
      reportType: row.reportType,
      site: row.site.id,
      buildingGroup: row.buildingGroup.id,
      building: row.building.id,
      startDate: row.startDate,
      status: row.status,
    });
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });
    this.editRows.push(cloneDeep(row));
    row.action = 'update';
    this.rows[index] = row;

    this.rows = [...this.rows];
  }

  saveRow(row) {
    let index = findIndex(this.rows, (item) => {
      return `${row.id}` == `${item.id}`;
    });

    if (this.rows[index].scheduleName === null || this.rows[index].scheduleName === '') {

    } else {
      this.rows[index] = row;
      let editRowIndex = findIndex(this.editRows, (item: any) => {
        return `${row.id}` == `${item.id}`;
      });
      this.editRows.splice(editRowIndex, 1);

      this.returnData = {
        categoryName: LocationType[this.selectedLocation],
        name: this.scheduleForm.value.scheduleName,
        scheduleAttributes: {},
        reportType: this.scheduleForm.value.reportType,
        startDate: this.scheduleForm.value.startDate,
        status: this.scheduleForm.value.status
      };

      switch (this.selectedLocation) {
        case LocationType.Site:
          this.returnData.scheduleAttributes['siteId'] = Number(this.scheduleForm.value.site);

          break;

        case LocationType.BuildingGroup:
          this.returnData.scheduleAttributes['siteId'] = Number(this.scheduleForm.value.site);
          this.returnData.scheduleAttributes['buildingGroupId'] = Number(this.scheduleForm.value.buildingGroup);
          break;

        case LocationType.Building:
          this.returnData.scheduleAttributes['siteId'] = Number(this.scheduleForm.value.site);
          this.returnData.scheduleAttributes['buildingGroupId'] = Number(this.scheduleForm.value.buildingGroup);
          this.returnData.scheduleAttributes['buildingId'] = Number(this.scheduleForm.value.building);
          break;
      }

      if (row.action == 'insert') {
        remove(this.rows, (item) => {
          return `${item.id}` === `${row.id}`;
        });
        this.insertData.emit(this.returnData);
      } else if (row.action == 'update') {
        this.updateData.emit({
          scheduleId: row.id,
          updatedDta: this.returnData
        });
      }
      row.action = 'NONE';
      this.rows = [...this.rows];
    }
    this.setInitialForm();
    this.scheduleForm.reset(this.scheduleForm.value);
    this.disabledAddEdit = false;
  }

  setInitialForm() {
    const buildingList = this.initialService.navigationStore.getBuildingsByBuildingGroup(this.buildingGroups[0].buildingGroupID);
    this.buildings = buildingList.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
    this.scheduleForm = this.fb.group({
      id: [`${(+new Date).toString(36)}/insert`, Validators.required],
      scheduleName: ['', Validators.required],
      reportType: ['Daily', Validators.required],
      site: [this.sites[0].siteID, Validators.required],
      buildingGroup: this.buildingGroups[0].buildingGroupID,
      building: this.buildings[0].buildingID,
      startDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      status: ['ACTIVE', Validators.required],
      action: ['insert', Validators.required],
    });
  }

  deleteRow(row) {
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Are you sure you want to delete this schedule?';
    modalRef.result.then((result) => {
      if (result == 'Cross click') {
        remove(this.rows, (item) => {
          return `${item.id}` === `${row.id}`;
        });
        this.rows = [...this.rows];
        this.deleteData.emit(row.id);
      }
    }, error => { });
  }

  searchByTermAction(data){
   if (this.searchTerm == '') {
    return data;
   } else {
     let searchResults = [];
     searchResults.push(...filter(data, (item) => {
      return item.scheduleName.toUpperCase().includes(this.searchTerm.toUpperCase());
    }));
     searchResults.push(...filter(data, (item) => {
      return item.reportType.toUpperCase().includes(this.searchTerm.toUpperCase());
    }));
     searchResults.push(...filter(data, (item) => {
      return item.site.name.toUpperCase().includes(this.searchTerm.toUpperCase());
    }));
     searchResults.push(...filter(data, (item) => {
      return item.buildingGroup.name.toUpperCase().includes(this.searchTerm.toUpperCase());
    }));
     searchResults.push(...filter(data, (item) => {
      return item.building.name.toUpperCase().includes(this.searchTerm.toUpperCase());
    }));
     searchResults.push(...filter(data, (item) => {
      return item.startDate.includes(this.searchTerm);
    }));
     searchResults.push(...filter(data, (item) => {
      return item.status.toUpperCase().includes(this.searchTerm.toUpperCase());
    }));
     return uniqueBy(searchResults, 'id');
   }
  }

  cancelEditInsertAction(row) {
    if (`${row.id}`.includes('insert')) {
      remove(this.rows, (item) => {
        return `${item.id}` === `${row.id}`;
      });
    } else {
      let index = findIndex(this.rows, (item) => {
        return `${row.id}` == `${item.id}`;
      });

      let editRowIndex = findIndex(this.editRows, (item: any) => {
        return `${row.id}` == `${item.id}`;
      });
      row.action = 'NONE';
      this.rows[index] = this.editRows[editRowIndex];
      this.editRows.splice(editRowIndex, 1);
    }
    this.rows = [...this.rows];
    this.disabledAddEdit = false;
  }

}
