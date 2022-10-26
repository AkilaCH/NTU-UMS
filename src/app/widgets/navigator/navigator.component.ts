import { InitialService } from 'src/app/services/initial.service';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HeaderService} from 'src/app/services/header.service';
import {HttpService} from 'src/app/services/http.service';
import {faChevronCircleDown, faChevronCircleUp} from '@fortawesome/free-solid-svg-icons';
import orderBy from 'lodash/orderBy';
import { ServiceType } from 'src/enums/ServiceType';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})

export class NavigatorComponent implements OnInit {

  arrowDown = faChevronCircleDown;
  arrowUp = faChevronCircleUp;
  datasourse: any[] = [];
  callapseCat: boolean[] = [];
  buildingGroups: any = [];
  serviceType: ServiceType;

  @Input() building_levels;
  boardLevel: number;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private headerService: HeaderService,
    private httpService: HttpService,
    private config: InitialService,
    private initialService: InitialService
  ) {
    this.headerService.boardLevel.subscribe(level => {
      this.boardLevel = level;
      if (level == 0) {
        this.serviceType = ServiceType.ELECTRICAL;
      } else {
        this.serviceType = ServiceType.WATER;
      }
    });

    this.getSites();

  }

  ngOnInit() {
  }

  navigateToUrl(url: string, buildingId: number, buildingName: string) {
    this.router.navigateByUrl(encodeURI(url));
    this.headerService.fireNavigationChanged();
    if (buildingId !== null) {
      this.headerService.setItem(buildingName);
      this.httpService.setbuildingId(buildingId);
    } else {
      this.headerService.setItem('Nanyang Technological University');
    }

    this.modalService.dismissAll();
  }

  navigateToSite(url: string) {
    this.router.navigateByUrl(encodeURI(url));
  }

  getSites() {
    this.getCategories(
      this.config.siteConfigurations.siteId,
      this.config.siteConfigurations.siteName
    );
  }

  getCategories(siteId: number, siteName) {
    let categories = this.initialService.navigationStore.buildingCategories;
    categories = orderBy(categories, ['description'], ['asc']);
    this.getBuildingGroups(categories, siteName, siteId);
  }

  getBuildings(categoryRes, siteName: string, siteId: number) {
    const siteNavigation = {
      siteId,
      siteName,
      siteCategories: []
    };
    let catCount = 0;
    categoryRes.forEach((element) => {
      let res = this.initialService.navigationStore.getBuildingsByCategory(element.buildingCategoryID);
      res = res.filter(x => x.serviceTypes.some(y => y.serviceTypeID == this.serviceType));
      let getRes = [];
      res.forEach(element => {
        getRes.push(this.getBuildingGroupName(element));
      });

      let groupedArr = this.groupBy(getRes, 'buildingGroupID', 'buildingGroupName');
      let catD = [];
      for (let i in groupedArr) {
        catD.push({
          buildingGroupID: i.split(',')[0],
          buildingGroupName: i.split(',')[1],
          data: groupedArr[i]
        });
      }

      const buildingsCategory = {
        categoryId: element.buildingCategoryID,
        categoryName: element.description,
        buildingList: catD
      };

      if (catD.length != 0) {
        siteNavigation.siteCategories.push(buildingsCategory);
        for (let j = 0; j < catD.length; j++) {
          this.buildingGroups[catCount][j] = false;
        }
        this.callapseCat.push(false);
        catCount++;
      }
    });
    
    for (let siteCats of siteNavigation.siteCategories) {
      for (let buildingList of siteCats.buildingList) {
        buildingList.data = orderBy(buildingList.data, ['buildingName'], ['asc']);
      }
      siteCats.buildingList = orderBy(siteCats.buildingList, ['buildingGroupName'], ['asc']);
    }
    this.headerService.setBuildingMenu(siteNavigation);
    this.datasourse.push(siteNavigation);
  }

  groupBy(OurArray, p1, p2) {
    return OurArray.reduce((accumulator, object) => {
      const key = object[p1] + ',' +  object[p2];
      !accumulator[key] ? (accumulator[key] = [object]) : (accumulator[key].push(object));
      return accumulator;
    }, {});
  }

  getBuildingGroupName(element) {
    const buildingName = this.buildingGroups.find(x => x.buildingGroupID == element.buildingGroupID);
    return {
      ...element, 
      buildingGroupName: buildingName?buildingName.description: null};
  }

  getBuildingGroups(categoryRes, siteName, siteId) {
    this.buildingGroups = this.initialService.navigationStore.buildingGroupsByServiceType(this.serviceType);
    this.buildingGroups = orderBy(this.buildingGroups, ['description'], ['asc']);
    this.getBuildings(categoryRes, siteName, siteId);
  }

  expandCallpse(index) {
    const temp = this.callapseCat[index];
    this.callapseCat.forEach((category, c) => {
      this.callapseCat[c] = false;
    });
    this.callapseCat[index] = !temp;
  }

  expandGroup(i, j) {
    const temp = this.buildingGroups[i][j];
    this.datasourse[0].siteCategories.forEach((category, c) => {
      category.buildingList.forEach((group, g) => {
        this.buildingGroups[c][g] = false;
      });
    });
    this.buildingGroups[i][j] = !temp;
  }
}
