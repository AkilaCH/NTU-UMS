import { Component, OnInit, Output, Input, EventEmitter, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import {  faBell } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertInfoComponent } from '../alert-info/alert-info.component';
import NotificationItem from 'src/app/models/notification';
import Moment from 'moment';
import { NavigationService } from 'src/app/store/navigation.service';
import Reverse from 'lodash/reverse';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent implements OnInit {
  showPanel: boolean;
  @Input() notifications: NotificationItem[] = [];
  @Output() onPanelView = new EventEmitter();
  notificationCount = [];

  @ViewChild('panel', null) panel: ElementRef;
  @ViewChild('clearall', null) clearText: ElementRef;
  @ViewChild('alertItem', null) alertItem: ElementRef;
  badgeText:string = "";

  bellIcon = faBell;

  constructor(  private modalService: NgbModal, private navigationStore: NavigationService, private headerService: HeaderService ) {
    this.navigationStore.notificationsCount$.subscribe(res=>{
      this.notificationCount = res;
      this.changeBadgeText();
    })
  }

  ngOnChanges(){
    let data = [...this.notifications];
    this.notifications = [...Reverse(data)];
  }

  ngOnInit() {
    this.headerService.panelView.subscribe(view => this.showPanel = view);
  }

  iconClicked(event) {
    this.headerService.changePanelVisibility(!this.showPanel);
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    try {
      if (!this.panel.nativeElement.contains(event.target)) {
        this.headerService.changePanelVisibility(!this.showPanel);
      }
    } catch (e) {}
  }

  changeBadgeText() {
    if(this.notificationCount.length>=99) {
      this.badgeText = '99+'
    } else if(this.notificationCount.length==0){
      this.badgeText = '';
    }
    else {
      this.badgeText = `${this.notificationCount.length}`;
    }
  }

  isViewedNotification(item:NotificationItem){
    return this.navigationStore.isViewedNotification(item.AlertTimeStamp);
  }

  removeFromCount(item:NotificationItem){
    this.navigationStore.removeNotificationCountItem(item.AlertTimeStamp);
  }

  getMomentAgo(date) {
    return Moment(date).fromNow();
  }

  onNotificationClicked() {
    this.showPanel = !this.showPanel;
    const modal = this.modalService.open(AlertInfoComponent, { size: 'lg', scrollable: true, windowClass: 'modal-width', centered: true});
  modal.componentInstance.alertInfo = { data: {}, type: '' };
  }

  clearAllNotifications() {
    this.navigationStore.removeAllNotifiations()
  }

  onNotificationPanelView() {
    this.showPanel = !this.showPanel;
    if(this.showPanel) {
      this.onPanelView.emit();
    }
  }

}
