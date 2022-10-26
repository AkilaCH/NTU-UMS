import { Component, OnInit, Input } from '@angular/core';
import { faBars, faCalendarDay, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from '../../services/header.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { NavigatorComponent } from '../navigator/navigator.component';
import {ResponsiveService} from '../../services/responsive.service';
import { SubstationNavigatorComponent } from '../substation-navigator/substation-navigator.component';
import {DashboardType} from 'src/enums/DashboardType';
import { NavigationService } from 'src/app/store/navigation.service';
import NotificationItem from 'src/app/models/notification';
import Reverse from 'lodash/reverse';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  editIcon = faFolderOpen;

  calendarIcon = faCalendarDay;

  homeIcon = faBars;

  boardLevel: number = 0;

  selectedItem: string = "N/A";

  dateRange = '01/07/2019 - 01/08/2019';

  dashboardType: DashboardType;

  allNotifications: NotificationItem[] = [];

  constructor(
    private headerService: HeaderService,
    private modalService: NgbModal,
    private responsiveService: ResponsiveService,
    private navigationStore: NavigationService
  ) {}

  ngOnInit() {
    this.headerService.item.subscribe(item => {
      this.selectedItem = item;
    });

    this.navigationStore.notifications$.subscribe(res=>{
      this.allNotifications = res;
    });

    this.headerService.boardLevel.subscribe(level => {
      this.boardLevel = level;
    });

    this.headerService.electricalDashboardType.subscribe(type => {
      this.dashboardType = type;
    });
  }

  open() {
    let component;
    switch (this.dashboardType) {
      case DashboardType.HIGH_TENSION:
        component = SubstationNavigatorComponent;
        break;
      case DashboardType.LOW_TENSION:
        component = NavigatorComponent;
        break;
      case DashboardType.WATER:
        component = NavigatorComponent;
        break;
    }

    const modal = this.modalService.open(component, { size: 'lg', scrollable: true});
    modal.componentInstance.title = "Locations";

  }

  toggleSideBar() {
    this.headerService.toggleSideBar();
  }

  isMobile() {
    return this.responsiveService.isMobile()
  }
}
