import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from '../../../app/services/header.service';
import { HttpService } from '../../..//app/services/http.service';
import { InitialService } from 'src/app/services/initial.service';

@Component({
  selector: 'app-substation-navigator',
  templateUrl: './substation-navigator.component.html',
  styleUrls: ['./substation-navigator.component.scss']
})
export class SubstationNavigatorComponent implements OnInit {

  siteId: number;
  siteName: string;
  loops: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private headerService: HeaderService,
    private httpService: HttpService,
    private configs: InitialService
  )
  {
    this.getHtLoops();
  }

  ngOnInit() {
    this.siteId = this.configs.siteConfigurations.siteId;
    this.siteName = this.configs.siteConfigurations.siteName;
  }

  async getHtLoops() {
    this.httpService.get(
      this.configs.endPoints['ht-loops'],
      {
        siteId : 1
      }).subscribe(data => {
        this.loops = data;
      },
      error => {
        this.loops = null;
      });
  }

  navigate(loopId, loopName) {
    this.router.navigateByUrl(`/ht-electrical-loop/${loopId}`);
    this.headerService.fireNavigationChanged();
    this.headerService.setItem(loopName);
    this.modalService.dismissAll();
  }
}
