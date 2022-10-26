import { HeaderService } from './../../services/header.service';
import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import { DateServiceService } from 'src/app/services/date-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationBoxComponent } from 'src/app/widgets/confirmation-box/confirmation-box.component';
import { AlertInfoComponent } from 'src/app/widgets/alert-info/alert-info.component';
import { AlertConfigurationBoxComponent } from 'src/app/widgets/alert-configuration-box/alert-configuration-box.component';
import { InitialService } from 'src/app/services/initial.service';
import { AlertService } from 'src/app/services/dashboards/alert.service';
import { ServiceType } from 'src/enums/ServiceType';
import uniqBy from 'lodash/uniqBy';
import filter from 'lodash/filter';
import { NotifierService } from 'angular-notifier';
import { result } from 'lodash-es';
import { BenchMarkType } from 'src/enums/bench-mark-type.enum';
import { LeakageInformationComponent } from 'src/app/widgets/leakage-information/leakage-information.component';

@Component({
  selector: 'app-alerts-dashboard',
  templateUrl: './alerts-dashboard.component.html',
  styleUrls: ['./alerts-dashboard.component.scss']
})
export class AlertsDashboardComponent implements OnInit {

  private readonly notifier: NotifierService;

  today: Date;
  tabIndex: number;
  pageIndex: number;
  ltDateRange: DateRange;
  htDateRange: DateRange;
  waterDateRange: DateRange;
  chillerDateRange: DateRange;
  ldWaterDateRange: DateRange;
  ColumnMode = ColumnMode;
  summaryFilterdFields: any = {
    buildingGroupId: 0,
    buildingId: 0,
    levelId: 0,
    substationId: 0,
    loopId: 0,
    plantId: 0
  };
  selectedRows = [];
  sampleRows = [];
  serviceTypes = ServiceType;

  isSummaryLoading: boolean;
  elecLtSummaryDataSource: any;
  elecHtSummaryDataSource: any;
  waterSummaryDataSource: any;
  chillerSummaryDataSource: any;
  ldWaterSummaryDataSource: any;

  summaryFilteredData: any = [];
  isAcknowledgedAll: boolean;
  isConfigurationLoading: boolean;
  elecLtConfigurationDataSource: any;
  elecHtConfigurationDataSource: any;
  waterConfigurationDataSource: any;
  chillerConfigurationDataSource: any;
  ldConfigurationData: any;

  ltConfigurationFilteredData: any = [];
  htConfigurationFilteredData: any = [];
  waterConfigurationFilteredData: any = [];
  chillerConfigurationFilteredData: any = [];
  ldConfigurationFilteredData: any = [];

  alertsDataSource = {
    row: [],
    ltColumns: [
      {
        key:"time",
        name: "Time"
      },
      {
        key:"buildingGroup",
        name: "Building Group"
      },
      {
        key:"building",
        name: "Building"
      },
      {
        key:"level",
        name: "Level"
      },
      {
        key:"location",
        name: "Location"
      },
      {
        key:"equipment",
        name: "Equipment"
      },
      {
        key:"detectedValue",
        name: "Detected Value"
      },
      {
        key:"benchmarkValue",
        name: "Threshold"
      },
      {
        key:"status",
        name: "Status"
      },
      {
        key:"buttonGroupAction",
        name: "Action"
      }
    ],
    htColumns: [
      {
        key:"time",
        name: "Time"
      },
      {
        key:"loop",
        name: "Loop"
      },
      {
        key:"substation",
        name: "Substation"
      },
      {
        key:"equipment",
        name: "Equipment"
      },
      {
        key:"detectedValue",
        name: "Detected Value"
      },
      {
        key:"benchmarkValue",
        name: "Threshold"
      },
      {
        key:"status",
        name: "Status"
      },
      {
        key:"buttonGroupAction",
        name: "Action"
      }
    ],
    chillerColumns: [
      {
        key:"time",
        name: "Time"
      },
      {
        key:"plant",
        name: "Plant"
      },
      {
        key:"equipment",
        name: "Equipment"
      },
      {
        key:"detectedValue",
        name: "Detected Value"
      },
      {
        key:"benchmarkValue",
        name: "Threshold"
      },
      {
        key:"status",
        name: "Status"
      },
      {
        key:"buttonGroupAction",
        name: "Action"
      }
    ]
  };
  modelId: number;

  constructor(
    private headerService: HeaderService,
    private modalService: NgbModal,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private alertService: AlertService,
    private notifierService: NotifierService
    ) {
      this.headerService.setItem('Alerts');
      this.headerService.setBoardLevel(2);
      this.tabIndex = 0;
      this.pageIndex = 0;
      this.modelId = 0;
      this.ltDateRange = this.dateService.getTodayUpToNow(new Date());
      this.htDateRange = this.dateService.getTodayUpToNow(new Date());
      this.waterDateRange = this.dateService.getTodayUpToNow(new Date());
      this.chillerDateRange = this.dateService.getTodayUpToNow(new Date());
      this.ldWaterDateRange = this.dateService.getTodayUpToNow(new Date());
      if (this.initialService.getDemoConfig().isDemo) {
        this.today = new Date(this.initialService.getDemoConfig().demoDate);
      } else {
        this.today = new Date();
      }
      this.isSummaryLoading = true;
      this.alertService.getWaterElectAlertSummary(this.ltDateRange, ServiceType.ELECTRICAL).then(res => {
        this.elecLtSummaryDataSource = res;
        this.isSummaryLoading = false;
      });
      this.notifier = this.notifierService;
    }

  ngOnInit() { }

  getTabName() {
    switch (this.tabIndex) {
      case 0:
        return 'lt';
      case 1:
        return 'ht';
      case 2:
        return 'water';
      case 3:
        return 'chiller';
    }
  }

  getLTSummaryData() {
    this.isSummaryLoading = true;
    this.alertService.getWaterElectAlertSummary(this.ltDateRange, ServiceType.ELECTRICAL).then(res => {
      this.elecLtSummaryDataSource = res;
      this.isSummaryLoading = false;
    });
  }

  getHTSummaryData() {
    this.isSummaryLoading = true;
    this.alertService.getHTAlertAlertSummary(this.htDateRange, ServiceType.HT_ELECTRICAL).then(res => {
      this.elecHtSummaryDataSource = res;
      this.isSummaryLoading = false;
    });
  }

  getWaterSummaryData() {
    this.isSummaryLoading = true;
    this.alertService.getWaterElectAlertSummary(this.waterDateRange, ServiceType.WATER).then(res => {
      this.waterSummaryDataSource = res;
      this.isSummaryLoading = false;
    });
  }

  getChillerData() {
    this.isSummaryLoading = true;
    this.alertService.getChillerAlertSummaryData(this.chillerDateRange).then(res => {
      this.chillerSummaryDataSource = res;
      this.isSummaryLoading = false;
    });
  }

  getLDWaterSummeryData() {
    this.isSummaryLoading = true;
    this.alertService.getLDWaterSummeryData(this.ldWaterDateRange).then(res => {
      this.ldWaterSummaryDataSource = res;
      this.summaryFilteredData = res;
      this.disableAcknowledgedAllButton();
      this.isSummaryLoading = false;
    });
  }

  onScenarioChangeSummary(id) {
    this.modelId = Number(id);
    if (id != 0) {
      this.summaryFilteredData = this.ldWaterSummaryDataSource.filter(x => x.scenarioId == id);
    } else {
      this.summaryFilteredData = this.ldWaterSummaryDataSource;
    }
    this.disableAcknowledgedAllButton();
  }

  onScenarioChangeConfiguration(id) {
    if (id != 0) {
      this.ldConfigurationFilteredData = this.ldConfigurationData.filter(x => x.scenarioId == id);
    } else {
      this.ldConfigurationFilteredData = this.ldConfigurationData;
    }
  }

  ldAlertAcknowledge(e) {
    const body = [{
        MeterId: e.data.meterAId,
        MeterBId: e.data.meterBId,
        Alerts: [{
          Guid: e.data.id,
          Status: 0
        }]
      }];
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Do you want to Acknowledge this Alert?';
    modalRef.result.then(() => {
      this.alertService.acknowledgeLDAlerts(body).then((res: any) => {
        if (res.StatusCode == 200 && res.Message == 'Success') {
          this.summaryFilteredData.find(x => x.id == e.data.id).status = 'Acknowledged';
          this.notifier.notify('success', 'Alert Successfully Acknowledged');
        } else {
          this.notifier.notify('error', 'Failed to Acknowledge the Alert');
        }
      });
    }, () => { });
  }

  acknowledgeAllLDAlerts() {
    const body = [];
    this.ldWaterSummaryDataSource.forEach(element => {
      body.push({
        MeterId: element.meterAId,
        MeterBId: element.meterBId,
        Alerts: [{
          Guid: element.id,
          Status: 0
        }]
      });
    });
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Do you want to Acknowledge all Alerts?';
    modalRef.result.then(() => {
      this.alertService.acknowledgeLDAlerts(body).then((res: any) => {
        if (res.StatusCode == 200 && res.Message == 'Success') {
          this.summaryFilteredData.forEach(element => {
            element.status = 'Acknowledged';
          });
          this.notifier.notify('success', 'All Alerts Successfully Acknowledged');
        } else {
          this.notifier.notify('error', 'Failed to Acknowledge all Alerts');
        }
      });
    }, () => { });
    this.disableAcknowledgedAllButton();
  }

  disableAcknowledgedAllButton() {
    this.isAcknowledgedAll = true;
    this.summaryFilteredData.forEach(element => {
      if (element.status == 'Pending') {
        this.isAcknowledgedAll = false;
        return;
      }
    });
  }

  exportLDAlerts() {
    this.alertService.exportLDAlerts(this.ldWaterDateRange, this.modelId);
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
    this.pageIndex = 0;

    switch (index) {
      case 0:
        if (!this.elecLtSummaryDataSource) {
         this.getLTSummaryData();
        }
        break;
      case 1:
        if (!this.elecHtSummaryDataSource) {
         this.getHTSummaryData();
        }
        break;
      case 2:
        if (!this.waterSummaryDataSource) {
          this.getWaterSummaryData();
        }
        break;
      case 3:
        if (!this.chillerSummaryDataSource) {
         this.getChillerData();
        }
        break;
      case 4:
        if (!this.ldWaterSummaryDataSource) {
         this.getLDWaterSummeryData();
        }
        break;
      default:
        if (!this.elecLtSummaryDataSource) {
          this.getLTSummaryData();
        }
        break;
    }
  }

  setPage(index: number) {
    this.pageIndex = index;
    if (index == 1) {
      switch (this.tabIndex) {
        case 0:
          if (!this.elecLtConfigurationDataSource) {
            this.isConfigurationLoading = true;
            this.alertService.getElecWaterConfigurationData(ServiceType.ELECTRICAL).then(res => {
              this.elecLtConfigurationDataSource = res;
              this.isConfigurationLoading = false;
            });
          }
          break;

        case 1:
          if (!this.elecHtConfigurationDataSource) {
            this.isConfigurationLoading = true;
            this.alertService.getHTConfigurationData().then(res => {
              this.elecHtConfigurationDataSource = res;
              this.isConfigurationLoading = false;
            });
          }
          break;

        case 2:
          if (!this.waterConfigurationDataSource) {
            this.isConfigurationLoading = true;
            this.alertService.getElecWaterConfigurationData(ServiceType.WATER).then(res => {
              this.waterConfigurationDataSource = res;
              this.isConfigurationLoading = false;
            });
          }
          break;

        case 3:
          if (!this.chillerConfigurationDataSource) {
            this.isConfigurationLoading = true;
            this.alertService.getChillerConfigurationData().then(res => {
              this.chillerConfigurationDataSource = res;
              this.isConfigurationLoading = false;
            });
          }
          break;

        case 4:
          if (!this.ldConfigurationData) {
            this.isConfigurationLoading = true;
            this.alertService.getLDWaterConfigurationData().then(res => {
              this.ldConfigurationData = res;
              this.ldConfigurationFilteredData = res;
              this.isConfigurationLoading = false;
            });
          }
          break;
      }
    }
  }

  onDataFiltered(event) {
    this.summaryFilteredData = [];
    event.forEach(element => {
      this.summaryFilteredData.push({
        time: element.time.name,
        id: element.id.id,
        buildingGroup: element.buildingGroup ? element.buildingGroup.name : null,
        building: element.building ? element.building.name : null,
        level: element.level ? element.level.name : null,
        location: element.location ? element.location.name : null,
        equipment: element.equipment.name,
        equipmentId: element.equipment.id,
        detectedValue: element.detectedValue.name,
        benchmarkValue: element.benchmarkValue.name,
        status: element.status.name,
        loop: element.loop ? element.loop.name : null,
        substation: element.substation ? element.substation.name : null,
        plant: element.plant ? element.plant.name : null,
        buttonGroupAction: [
          {
            buttonName: 'Acknowledge',
            actionKey: 'acknowledge'
          }
        ]
      });
    });
    this.summaryFilteredData = [...this.summaryFilteredData];
  }

  exportAlerts(type: ServiceType){
    switch (type) {
      case ServiceType.ELECTRICAL:
        this.alertService.exportAlertsDetails(
          type,
          this.ltDateRange,
          this.summaryFilterdFields.buildingGroupId,
          this.summaryFilterdFields.buildingId,
          this.summaryFilterdFields.levelId
        );
        break;
      case ServiceType.WATER:
        this.alertService.exportAlertsDetails(
          type,
          this.waterDateRange,
          this.summaryFilterdFields.buildingGroupId,
          this.summaryFilterdFields.buildingId,
          this.summaryFilterdFields.levelId 
        );
        break;
      case ServiceType.MAIN_WATER:
        this.alertService.exportAlertsDetails(
          type,
          this.waterDateRange,
          this.summaryFilterdFields.buildingGroupId,
          this.summaryFilterdFields.buildingId,
          this.summaryFilterdFields.levelId 
        );
        break;
      case ServiceType.HT_ELECTRICAL:
        this.alertService.exportAlertsDetails(
          type,
          this.htDateRange,
          null,
          null,
          null,
          this.summaryFilterdFields.loopId,
          this.summaryFilterdFields.substationId
        );
        break;
      case ServiceType.MAIN_HT_ELECTRICAL:
        this.alertService.exportAlertsDetails(
          type,
          this.htDateRange,
          null,
          null,
          null,
          this.summaryFilterdFields.loopId,
          this.summaryFilterdFields.substationId
        );
        break;

      case ServiceType.CHILLER:
        this.alertService.exportAlertsDetails(
          type,
          this.chillerDateRange,
          null,
          null,
          null,
          null,
          null,
          this.summaryFilterdFields.plantId
        );
        break;
    }
  }

  onConfigurationFiltered(event) {
    switch (this.tabIndex) {
      case 0:
        this.ltConfigurationFilteredData = event;
        break;

      case 1:
        this.htConfigurationFilteredData = event;
        break;

      case 2:
        this.waterConfigurationFilteredData = event;
        break;

      case 3:
        this.chillerConfigurationFilteredData = event;
        break;
    }
  }


  tableActionOnClicked(event) {
    if(event.key == 'acknowledge') {
      const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
      modalRef.componentInstance.massage = 'Do you want to Acknowledge this Alert?';
      modalRef.result.then((result) => {
       this.acknowledgeRequest(event);
      }, (reason) => {
        // TODO: Do your task after dismissed the dialog box
      });
    }
  }

  private acknowledgeRequest(event) {
    let acknowledgable = [{
      MeterId: event.data.equipmentId,
      Alerts:[{Guid:event.data.id, Status:0}]
    }];
    this.alertService.acknowldgeAlerts(acknowledgable).then(res=>{
      try {
        if (res.StatusCode && res.StatusCode == 200) {
          this.notifier.notify('success', 'Alert Successfully Acknowledged');
          switch(this.tabIndex) {
            case 0:
              this.elecLtSummaryDataSource = [...this.acknowledgeAlert(event.data.id, this.elecLtSummaryDataSource)]
              break;
            case 1:
              this.elecHtSummaryDataSource = [...this.acknowledgeAlert(event.data.id, this.elecHtSummaryDataSource)]
              break;
            case 2:
              this.waterSummaryDataSource = [...this.acknowledgeAlert(event.data.id, this.waterSummaryDataSource)]
              break;
            case 3:
              this.chillerSummaryDataSource = [...this.acknowledgeAlert(event.data.id, this.chillerSummaryDataSource)]
              break;
          }
        } else {
          this.notifier.notify('error', 'Failed to Acknowledge an Alert');
        }
      } catch (e) {
        this.notifier.notify('error', 'Failed to Acknowledge an Alert');
      }
    });
  }

  private acknowledgeAlert(guid, data) {
    let index = data.findIndex(item=>item.id.id==guid);
    data[index].status.name = 'Acknowledged';
    return data;
  }

  onRowClicked(e) {
    const elementRef = this.modalService.open(AlertInfoComponent, { size: 'lg', scrollable: true, windowClass: 'modal-width', centered: true});
    elementRef.componentInstance.alertInfo = { data: e, type: this.getTabName(), tabIndex: this.tabIndex };
    elementRef.result.then((result) => {
      this.acknowledgeRequest({data: result.data, key: 'acknowledge'});
    }, (reason) => {
      // TODO: Do your task after dismissed the dialog box
    });
    
  }

  configSelectionChange(event) {
    if ( event.key == 'manual' ) {
      const elementRef = this.modalService.open(AlertConfigurationBoxComponent, { size: 'lg', scrollable: true, centered: true});
      elementRef.componentInstance.alertInfo = { data: event, type: this.getTabName() };
      elementRef.result.then((result) => {
        this.alertService.updateManualModeConfiguration(result).then(res=>{
          this.notifier.notify('success', `${event.row.equipment} Successfully Updated`);
          switch(this.tabIndex){
            case 0:
              this.elecLtConfigurationDataSource = [...this.updateMeterMode(this.elecLtConfigurationDataSource, result, meter, 'Manual')];
              break;
            case 1:
              this.elecHtConfigurationDataSource = [...this.updateMeterMode(this.elecHtConfigurationDataSource, result, meter, 'Manual')];
              break;
            case 2:
              this.waterConfigurationDataSource = [...this.updateMeterMode(this.waterConfigurationDataSource, result, meter, 'Manual')];
              break;
            case 3:
              this.chillerConfigurationDataSource = [...this.updateMeterMode(this.chillerConfigurationDataSource, result, meter, 'Manual')];
              break;
          }
        });
      }, (reason) => {
        // TODO: Do your task after dismissed the dialog box
      });
      let meter = [{
        MeterId: event.row.meterID,
        BenchmarkType: BenchMarkType.Manual,
      }];
      this.changeMeterMode(meter, 'Manual', event.row.equipment);
    } else {
      let meter = [{
        MeterId: event.row.meterID,
        BenchmarkType: BenchMarkType.Auto,
      }];
      this.changeMeterMode(meter, 'Auto', event.row.equipment);
    }
  }

  private updateMeterMode(dataset, updatedData, meter, updatingMode) {
    let index = dataset.findIndex(item=>meter[0].MeterId==item.meterID);
    let item = dataset[index];
    item.sundayBenchMark = updatedData[0].Benchmarks[0].Value;
    item.mondayBenchMark = updatedData[0].Benchmarks[1].Value;
    item.tuesdayBenchMark =  updatedData[0].Benchmarks[2].Value;
    item.wednesdayBenchMark =  updatedData[0].Benchmarks[3].Value;
    item.thursdayBenchMark =  updatedData[0].Benchmarks[4].Value;
    item.fridayBenchMark =  updatedData[0].Benchmarks[5].Value;
    item.saturdayBenchMark =  updatedData[0].Benchmarks[6].Value;
    dataset[index] = item;
    return dataset;
  }

  private changeMeterMode(meter, mode, meterName) {
    this.alertService.changeConfigurationMode(meter).then(res => {
      if (res.StatusCode && res.StatusCode == 200) {
        if (mode == 'Auto') {
          this.notifier.notify('success', `${meterName} Successfully Changed to ${mode} Mode`);
        }
      } else {
        if (mode == 'Auto') {
          this.notifier.notify('error', 'Failed to Change the Mode ');
        }
      }
    });
  }

  acknowledgeAll() {
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Do you want to Acknowledge all Alerts?';
    modalRef.result.then((result) => {
      // TODO: Acknowledge the alert after closed the dialog box
      let acknowledgable = [];
      let uniqMeters = uniqBy(this.summaryFilteredData, 'equipmentId');
      uniqMeters.forEach((item: any)=>{
        let meters = filter(this.summaryFilteredData, {'equipmentId': item.equipmentId});
        let meterForAck = { MeterId: item.equipmentId,  Alerts:[]};
        meters.forEach(alert=>{
          if(alert.status=='Pending') {
            meterForAck.Alerts.push({ Guid:`${alert.id}`, Status:0});
          }
        });
        if(meterForAck.Alerts.length > 0) {
          acknowledgable.push(meterForAck);
        }
      })
      if(acknowledgable.length > 0) {
        this.alertService.acknowldgeAlerts(acknowledgable).then(res=>{
          try {
            if (res.StatusCode && res.StatusCode == 200) {
              this.notifier.notify('success', 'All Alerts Successfully Acknowledged');
              switch(this.tabIndex){
                case 0:
                  this.changeAlertSummaryStatus(this.elecLtSummaryDataSource, acknowledgable);
                  this.elecLtSummaryDataSource = [...this.elecLtSummaryDataSource];
                  break;
                case 1:
                  this.changeAlertSummaryStatus(this.elecHtSummaryDataSource, acknowledgable);
                  this.elecHtSummaryDataSource = [...this.elecHtSummaryDataSource];
                  break;
                case 2:
                  this.changeAlertSummaryStatus(this.waterSummaryDataSource, acknowledgable);
                  this.waterSummaryDataSource = [...this.waterSummaryDataSource];
                  break;
                case 3:
                  this.changeAlertSummaryStatus(this.chillerSummaryDataSource, acknowledgable);
                  this.chillerSummaryDataSource = [...this.chillerSummaryDataSource];
                  break;
              }
            } else {
              this.notifier.notify('error', 'Failed to Acknowledge Alerts');
            }
          } catch (e) {
            this.notifier.notify('error', 'Failed to Acknowledge Alerts');
          }
        });
      } else {
        this.notifier.notify('warning', `No any alerts in PENDING status`);
      }
    }, (reason) => {
      // TODO: Do your task after dismissed the dialog box
    });
  }

  private changeAlertSummaryStatus(dataSet, acknowledgable) {
    acknowledgable.forEach(meter => { 
      meter.Alerts.forEach(alert => {
        let index = dataSet.findIndex(item=>item.id.id==alert.Guid);
        dataSet[index].status.name = 'Acknowledged';
      });
    });
  }

  changeActive(data) {
    let massage;
    if (data.event) {
      massage = 'Activate';
    } else {
      massage = 'Deactivate';
    }

    this.alertService.changeAlertConfigStatus([{
      MeterId: data.meterID,
      Status: data.event ? 1 : 2
    }]).then(res => {
      if (res.StatusCode && res.StatusCode == 200) {
        this.notifier.notify('success', `Meter Successfully ${massage}d`);
      } else {
        this.notifier.notify('error', `Failed to ${massage} Meter`);
      }
    });
  }

  openInfo(event) {
    const modalRef = this.modalService.open(LeakageInformationComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.data = event.selected[0];
    modalRef.result.then(() => { }, (reason) => {
      // TODO: Do your task after dismissed the dialog box
    });
  }

  onScenarioChange(e) {
    console.log(e);
    
  }
}
