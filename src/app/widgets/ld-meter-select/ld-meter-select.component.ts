import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { AlertService } from 'src/app/services/dashboards/alert.service';
import { InitialService } from 'src/app/services/initial.service';
import { ServiceType } from 'src/enums/ServiceType';
import { getBuildingGroupList, getBuildingList, getLevelList } from 'src/util/filtrationDropdownHelper';

@Component({
  selector: 'app-ld-meter-select',
  templateUrl: './ld-meter-select.component.html',
  styleUrls: ['./ld-meter-select.component.scss']
})
export class LdMeterSelectComponent implements OnInit {

  @Input() subMeters = [];
  selected = [];
  meters = [];
  rows = [];
  isLoading: boolean;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  buildingGroups: any = [];
  buildings: any = [];
  levels: any = [];
  selectedBuildingGroup: number;
  selectedBuilding: number;
  selectedLevel: number;

  constructor(
    private activeModal: NgbActiveModal,
    private initialService: InitialService,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.selectedBuilding = 0;
    this.selectedBuildingGroup = 0;
    this.buildingGroups = getBuildingGroupList(this.initialService.navigationStore.buildingGroupsByServiceType(ServiceType.WATER));
    this.loadData(this.selectedBuildingGroup, this.selectedBuilding);
  }

  loadData(buildingGroup, building) {
    this.isLoading = true;
    this.alertService.getWaterMeters(ServiceType.WATER, buildingGroup, building).then(res => {
      this.meters = res;
      this.rows = res;
      this.subMeters.forEach(element => {
        this.selected.push(res.find(x => x.meterID == element.meterID));
      });
      this.isLoading = false;
    });
  }

  close() {
    this.activeModal.dismiss();
  }

  onBuildingGroupChange(id) {
    this.selectedBuilding = 0;
    this.selectedBuildingGroup = Number(id);
    this.buildings = getBuildingList(this.initialService.navigationStore.getBuildingsByBuildingGroup(Number(id))
      .filter(building => building.serviceTypes.some(serviceType => serviceType.serviceTypeID == ServiceType.WATER)));
    this.levels = getLevelList(this.initialService.navigationStore.getLevelsByBuildingId(0));
    if (id == 0) {
      this.rows = this.meters;
    } else {
      this.rows = this.meters.filter(x => x.buildingGroupId == id);
    }
  }

  onBuildingChange(id) {
    this.selectedBuilding = Number(id);
    this.levels = getLevelList(this.initialService.navigationStore.getLevelsByBuildingId(Number(id)));
    if (id == 0) {
      this.rows = this.meters.filter(x => x.buildingGroupId == this.selectedBuildingGroup);
    } else {
      this.rows = this.meters.filter(x => x.buildingId == id);
    }
  }

  onLevelChange(id) {
    if (id == 0) {
      this.rows = this.meters.filter(x => x.buildingId == this.selectedBuilding);
    } else {
      this.rows = this.meters.filter(x => x.levelID == id);
    }
  }

  onSearchChange(searchKey) {
    this.rows = this.meters.filter(x => x.meterName.toUpperCase().includes(`${searchKey}`.toUpperCase()));
  }

  onActivate(event) {
    // (activate)="onActivate($event)" removed from table
    // console.log('Activate Event', event);
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onSelectMeters() {
    this.subMeters = [];
    this.selected.forEach(element => {
      this.subMeters.push({
        meterID: element.meterID,
        meterName: element.meterName
      });
    });
    this.activeModal.close(this.subMeters);
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
