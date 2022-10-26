import { ApplicationInitStatus, APP_INITIALIZER, Component, Inject, ViewChild } from '@angular/core';
import { HeaderService } from './services/header.service';
import { InitialService } from './services/initial.service';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { NotifierService } from "angular-notifier";
import NotificationItem from './models/notification';
import { NavigationService } from './store/navigation.service';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeakageInformationComponent } from 'src/app/widgets/leakage-information/leakage-information.component';
import { AfterViewInit } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  @ViewChild('normalNotification', { static: true }) normalNotificationTmpl;
  @ViewChild('ldNotification', { static: true }) ldNotificationTmpl;

  showPanel: boolean;
  isSideMenuActive: boolean;
  isUnderMaintenence: boolean;
  time: string;
  directionName :string;
  ldPopupData = {
    time: undefined,
    meters: undefined,
    maxError: undefined,
    error: undefined,
    direction:undefined
  };
  private _hubConnection: HubConnection;
  private readonly notifier: NotifierService;

  public constructor(
    private headerService: HeaderService,
    private initialService: InitialService,
    private router: Router,
    private notifierService: NotifierService,
    public navigationStore: NavigationService,
    private modalService: NgbModal
  ) {
    this.headerService.isSideBarActive.subscribe(isActive => {
      this.isSideMenuActive = isActive;
    });
    if (this.initialService.isUnderMaintenece()) {
      this.router.navigate(['maintenence']);
      this.isUnderMaintenence = initialService.isUnderMaintenece();
    }
    this.notifier = this.notifierService;
  }

  ngOnInit(): void {
    this._hubConnection = new HubConnectionBuilder().withUrl(`${this.initialService.getHost()}/notify`).build();
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this._hubConnection.on('BroadcastMessage', (MeterName: string, SpikeValue: string, BenchmarkValue: string, AlertTimeStamp: string) => {
      const notification = new NotificationItem(MeterName, SpikeValue, BenchmarkValue, AlertTimeStamp,undefined ,undefined, undefined);
      this.navigationStore.addNotification(notification);
      if (this.navigationStore.notifications.length >= 100) {
        this.navigationStore.removeOldestNotification();
      }
      this.time = `${moment(new Date(AlertTimeStamp)).fromNow()}`;
      this.notifier.show({
        message: `System has detected an abnormal usage in ${MeterName}.`,
        type: 'default',
        template: this.normalNotificationTmpl
      });
    });

    this._hubConnection.on('BroadcastRingMeterAlert', (meter1: string, meter2: string, error: number, maxError: number, to: string, from: string, id: any, type: any,directionId : string) => {
      const notification = new NotificationItem(meter1, error, maxError, from, meter2, to, directionId);
      this.navigationStore.addNotification(notification);
      if (this.navigationStore.notifications.length >= 100) {
        this.navigationStore.removeOldestNotification();
      }
      this.time = `${moment(new Date(to)).fromNow()}`;
      this.notifier.show({
        message: `System has detected a possible water leak between ${meter1} and ${meter2} meters.`,
        type: 'default',
        template: this.ldNotificationTmpl
      });
      
      this.ldPopupData.meters = `${meter1} and ${meter2}`;
      this.ldPopupData.error = error;
      this.ldPopupData.maxError = maxError;
      this.ldPopupData.direction = directionId;
      this.ldPopupData.time = `${moment(from).format('MM/DD/YYYY h:mm A')} to ${moment(to).format('MM/DD/YYYY h:mm: A')}`;
    });
    this.headerService.panelView.subscribe(view => this.showPanel = view);
  }

  onClickMore() {
    this.notifier.hideAll();
    const modalRef = this.modalService.open(LeakageInformationComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.data = this.ldPopupData;
    modalRef.result.then(() =>  { }, () => { });
  }

  closeNotification() {
    this.notifier.hideAll();
  }

  overlayClicked(){
    this.isSideMenuActive = false;
  }

  detectmob() {
    if(window.innerWidth <= 800) {
      return true;
    } else {
      return false;
    }
  }

}
