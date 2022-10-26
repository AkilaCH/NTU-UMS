import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { LdMeterSelectComponent } from '../ld-meter-select/ld-meter-select.component';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';
import { AlertService } from 'src/app/services/dashboards/alert.service';
import { ServiceType } from 'src/enums/ServiceType';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ld-configuration',
  templateUrl: './ld-configuration.component.html',
  styleUrls: ['./ld-configuration.component.scss']
})
export class LdConfigurationComponent implements OnInit {

  @Input() rows = [];
  @Input() isLoading;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  ColumnMode = ColumnMode;
  meterList = [];
  rowLimits = [
    {id: 1, name: 10},
    {id: 2, name: 15},
    {id: 3, name: 25},
    {id: 4, name: 50},
    {id: 5, name: 100}
  ];
  limit: number;
  plusIcon = faPlus;
  tempRow: any;

  private readonly notifier: NotifierService;

  constructor(
  //  @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private alertService: AlertService,
    notifierService: NotifierService,
    private modalService: NgbModal
    ) {
      this.notifier = notifierService;
      this.limit = 15;
  }

  ngOnInit() {
   // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.alertService.getWaterMeters(ServiceType.LD_WATER, 0, 0).then(res => {
      res.forEach(element => {
        this.meterList.push({
          id: element.meterID,
          name: element.meterName
        });
      });
    });
  }

  changeNoOfRows(event) {
    const rowLimit = this.rowLimits.find(x => x.id == event.value);
    this.limit = rowLimit.name;
  }

  onToggle(e, row) {
    const body = [{LdScenarioId: row.id, Status: e ? 1 : 2}];
    this.alertService.changeLDConfigScenario(body).then(res => {
      if (res.StatusCode == 200 && res.Message == 'Success') {
        row.status = e;
        this.notifier.notify('success', `Successfully ${e ? 'Activated' : 'Deactivated'} the Scenario`);
      } else {
        row.status = !e;
        this.notifier.notify('error', `Failed to ${e ? 'Activated' : 'Deactivated'} the Scenario`);
      }
    });
    row.edit = false;
    this.rows = [...this.rows];
  }

  onScenarioChange(row, e) {
    row.scenarioId = Number(e.value);
  }

  onMeterAChange(row, e) {
    row.meterA = this.meterList.find(x => x.id == e.value).name;
    row.meterAId = Number(e.value);
  }

  onMeterBChange(row, e) {
    row.meterB = this.meterList.find(x => x.id == e.value).name;
    row.meterBId = Number(e.value);
  }

  openMeterPopup(row) {
    const modalRef = this.modalService.open(LdMeterSelectComponent, { size: 'xl', centered: true});
    modalRef.componentInstance.subMeters = row.subMeters;
    modalRef.result.then((result) => {
      row.subMeters = result;
    }, (reason) => {
      // TODO: Do your task after dismissed the dialog box
    });
  }

  editClick(row) {
    this.rows.forEach(element => {
      element.edit = false;
    });
    this.tempRow = Object.assign({}, row);
    this.rows.find(x => x.id === row.id).edit = true;
  }

  deleteClick(id) {
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Do you want to Delete this Scenario?';
    modalRef.result.then((result) => {
      const body = [{LdScenarioId: id, Status: 3}];
      this.alertService.changeLDConfigScenario(body).then(res => {
        if (res.StatusCode == 200 && res.Message == 'Success') {
          const index = this.rows.findIndex(x => x.id === id);
          if (index > -1) {
            this.rows.splice(index, 1);
          }
          this.rows = [...this.rows];
          this.notifier.notify('success', 'Successfully Deleted the Scenario');
        } else {
          this.notifier.notify('error', 'Failed to Delete the Scenario');
        }
      });
    }, (reason) => {
      // TODO: Do your task after dismissed the dialog box
    });
  }

  saveClick(row) {
  
    const body = {
      ldModelId: row.scenarioId,
      meterAId: row.meterAId,
      meterBId: row.meterBId,
      subMeters: row.subMeters
    };
    if (!`${row.id}`.includes('addMeter')) {
      body['ldScenarioId'] = row.id;
    }
    this.alertService.addNewLdScenario(body).then(res => {

      if (res.StatusCode == 467) {
        this.notifier.notify('error', 'Scenario Already Exists');
        this.rows = [...this.rows];
      }
      
      if (res.StatusCode == 201 && res.Message == 'Created') {
        if (`${row.id}`.includes('addMeter')) {
          row.id = res.Data.ldScenarioId;
          this.notifier.notify('success', 'Successfully Added the Scenario');
        } else {
          this.notifier.notify('success', 'Successfully Updated the Scenario');
        }
      } else {
        const index = this.rows.findIndex(x => x.id === row.id);
        if(`${row.id}`.includes('addMeter')){
          if (index > -1) {
            this.rows.splice(index, 1);
          }
        } else {
          this.rows[index] = this.tempRow;
          this.rows = [...this.rows];
        }
        if (`${row.id}`.includes('addMeter')) {
          this.notifier.notify('error', 'Failed to Add the Scenario');
        } else {
          this.notifier.notify('error', 'Failed to Update the Scenario');
        }
      }
    });
    row.edit = false;
   // this._document.defaultView.location.reload();
  }

  cancelClick(row) {
    const index = this.rows.findIndex(x => x.id === row.id);
    if (`${row.id}`.includes('addMeter')) {
      if (index > -1) {
        this.rows.splice(index, 1);
      }
    } else {
      this.rows[index] = this.tempRow;
    }
    this.rows = [...this.rows];
  }

  addNewScenario() {
    this.table.offset = 0;
    this.rows.forEach((element, i) => {
      if (`${element.id}`.includes('addMeter')) {
        this.rows.splice(i, 1);
      }
      element.edit = false;
    });
    let row = {
      id: this.guidId(),
      status: true,
      scenarioId: 1,
      meterA: this.meterList[0].name,
      meterAId: this.meterList[0].id,
      meterB: this.meterList[0].name,
      meterBId: this.meterList[0].id,
      subMeters: [],
      edit: true
    };
    this.rows.unshift(row);
    this.rows = [...this.rows];
  }

  guidId() {
    return 'addMeter-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
