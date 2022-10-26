import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {HeaderService} from '../../services/header.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NavigatorComponent} from '../navigator/navigator.component';
import {VersionComponent} from '../version/version.component';
import { InitialService } from 'src/app/services/initial.service';
import {faChevronCircleDown, faChevronCircleUp} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SideBarComponent implements OnInit {

  menuItems: any = [];
  backArrow = faArrowLeft;
  isSideMenuActive: boolean;
  version: string;
  mainItemURL: string;
  subItemURL: string;

  arrowDown = faChevronCircleDown;
  arrowUp = faChevronCircleUp;

  constructor(
    private initialService: InitialService,
    private dataService: HttpService,
    private endPoints: InitialService,
    private headerService: HeaderService,
    private modalService: NgbModal,
    private router: Router
    ) {
    this.headerService.isSideBarActive.subscribe(isActive => {
      this.isSideMenuActive = isActive;
    });
    this.version = this.initialService.getVersion();
  }

  ngOnInit() {
    this.dataService.get(this.endPoints.endPoints["side-menu"], {}).subscribe(items => {
      this.menuItems = [];
      for (let i = 0; i < items.length; i++) {
        if(items[i].item !="Configuration"){
          this.menuItems.push(items[i])
        }
      }
      
      const url = this.menuItems.find(x => x.url == this.router.url);
      if (url) {
        this.mainItemURL = this.router.url;
      } else if (this.router.url == '/electrical-report') {
        this.subItemURL = '/electrical-report';
      } else if (this.router.url == '/water-report') {
        this.subItemURL = '/water-report';
      } else if (this.router.url.substring(1, 11) == 'electrical') {
        this.mainItemURL = '/site-electrical';
      } else if (this.router.url.substring(1, 6) == 'water') {
        this.mainItemURL = '/site-water';
      } else if (this.router.url.substring(1, 3) == 'ht') {
        this.mainItemURL = '/ht-site-electrical';
      } else if (this.router.url.substring(1, 16) == 'map/electricity') {
        this.subItemURL = '/map/electricity/main-map';
      } else if (this.router.url.substring(1, 10) == 'map/water') {
        this.subItemURL = '/map/water/main-map';
      } else {
        this.subItemURL = this.router.url;
      }

      this.router.events.subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          const newUrl = this.menuItems.find(x => x.url == event.url);
          this.subItemURL = '';
          this.mainItemURL = '';
          if (newUrl) {
            this.mainItemURL = event.url;
          } else if (event.url == '/electrical-report') {
            this.subItemURL = '/electrical-report';
          } else if (event.url == '/water-report') {
            this.subItemURL = '/water-report';
          } else if (event.url.substring(1, 11) == 'electrical') {
            this.mainItemURL = '/site-electrical';
          } else if (event.url.substring(1, 6) == 'water') {
            this.mainItemURL = '/site-water';
          } else if (event.url.substring(1, 3) == 'ht') {
            this.mainItemURL = '/ht-site-electrical';
          } else if (event.url.substring(1, 16) == 'map/electricity') {
            this.subItemURL = '/map/electricity/main-map';
          } else if (event.url.substring(1, 10) == 'map/water') {
            this.subItemURL = '/map/water/main-map';
          } else {
            this.subItemURL = event.url;
          }
        }
      });
    });
  }

  onMainItemSelected(item) {
    this.subItemURL = '';
    if (item != '#') {
      this.mainItemURL = item;
    }
  }
  onSubItemSelected(item) {
    this.mainItemURL = '';
    if (item != '#') {
      this.subItemURL = item;
    }
  }

  toggleSideBar() {
    this.headerService.toggleSideBar();
  }

  showProgress(item) {
    switch (item) {
      default:
        return item;
    }
  }

  openVersionModel() {
    const modal = this.modalService.open(VersionComponent, { size: 'lg', scrollable: true});
    modal.componentInstance.title = "Locations";
  }
}
