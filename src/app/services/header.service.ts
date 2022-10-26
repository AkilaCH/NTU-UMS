import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpService} from './http.service';
import {DashboardType} from 'src/enums/DashboardType';
import { InitialService } from './initial.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private showPanel = new BehaviorSubject(false);
  panelView = this.showPanel.asObservable();

  item = new BehaviorSubject('N/A');

  buildingMenuItems: any = null;

  electricalDashboardType = new BehaviorSubject<DashboardType>(DashboardType.LOW_TENSION);

  boardLevel = new BehaviorSubject<number>(0);

  serviceType = new BehaviorSubject<number>(0);

  isSideBarActive = new BehaviorSubject<boolean>(false);

  chartWidth = new BehaviorSubject<number>(window.innerWidth - 110);

  navigationChanged: EventEmitter<number> = new EventEmitter();

  constructor(
    private  dataService: HttpService,
    private configService: InitialService
  ) { }

  changePanelVisibility(show: boolean) {
    this.showPanel.next(show);
  }

  setItem(item: string) {
    this.item.next(item);
  }

  setBoardLevel(level: number) {
    this.boardLevel.next(level);
  }

  toggleSideBar() {
    this.isSideBarActive.next(!this.isSideBarActive.value);
    if (this.isSideBarActive.value) {
      this.chartWidth.next(window.innerWidth - 320);
    } else {
      this.chartWidth.next(window.innerWidth - 100);
    }
  }

  getChartWidth(){
    return this.chartWidth.asObservable();
  }

  getBuildingMenu() {
    return this.buildingMenuItems;
  }

  setBuildingMenu(menuList) {
    this.buildingMenuItems = menuList;
  }


  fireNavigationChanged() {
    this.navigationChanged.emit();
  }

}
