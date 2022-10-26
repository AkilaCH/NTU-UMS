import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DummyDataService} from 'src/app/services/sample/dummy-data.service';
import {HeaderService} from 'src/app/services/header.service';
import {HttpService} from 'src/app/services/http.service';
import {DateServiceService} from 'src/app/services/date-service.service';
import {InitialService} from 'src/app/services/initial.service';
import { forkJoin } from 'rxjs';
import { fixDecimalNumPrecision } from 'src/util/ChartHelper';
import { DateRange } from '../date-range-picker/public-api';
import { ThousandSeparatorPipe } from 'src/app/pipes/thousand-separator.pipe';
import { abbreviateNumber } from '../../../util/ChartHelper';

let scrolTop = 0;
@Component({
  selector: 'app-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [

      state('in', style({transform: 'scale(1)', opacity: 1})),

      transition(':enter', [
        style({transform: 'scale(0)', opacity: 0}),
        animate(400)
      ]),

      transition(':leave',
        animate(400, style({transform: 'scale(0)', opacity: 0})))
    ])
  ]
})

export class ImageMapComponent implements OnInit {

  @ViewChild('myDetailDiv', null) detailCard: ElementRef;
  @ViewChild('myZoneDev', null) zoneCard: ElementRef;
  datasourse: any;
  type: string;
  building: string;
  scrolTop = 0;
  cardDetails: number;
  today: Date;
  minDate: Date;
  title: string;
  unit: string;
  buildingName: string;
  imageWidth: number;
  imageHeight: number;
  disableLoading: boolean;
  buildingsResponses: object;
  dateRange: DateRange;
  breadcrumbData = [];
  iconURL: string;
  suffix: any;
  mapPicker: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataServiceConfig: DummyDataService,
    private router: Router,
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: InitialService,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private datePipe: DatePipe,
    private thousandSeparator: ThousandSeparatorPipe
  ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
    this.minDate = new Date(this.today);
    this.minDate.setFullYear(this.minDate.getFullYear() - 1);
    this.dateRange = this.dateService.thisMonthUpToNow(this.today);
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.breadcrumbData = [
        {name: 'campus', url: `/map/${params.type}/main-map`}
      ];
      if (params.building != 'main-map') {
        this.breadcrumbData.push({name: params.building, url: ''});
      }
      this.type = params.type;
      this.building = params.building;
      this.datasourse = null;
      this.getBuildingMap();
    });
    this.headerService.setItem('Site Map');


    window.addEventListener('scroll', function(event) {
      scrolTop = this.scrollY;
    }, false);

    if(this.mapPicker){
      setTimeout(() => this.exectMap(), 2000)
    }
  }

  imageGenerator = (type, link) => {
    const name = {'electricity': 'elec_map', 'water': 'elec_map',}
    link = link.split('/');
    const imageFile = link[link.length - 1];
    return `assets/img/zone-map/${imageFile}`;

    return `assets/img/${name[type]}/${imageFile}`;
  }
  
  getBuildingMap() {
    switch (this.type) {
      case 'electricity':
        this.title = 'NTU Map Electricity';
        this.unit = 'kWh';
        this.iconURL = '../../../assets/img/overview/electrical.png';
        break;
      case 'water':
        this.title = 'NTU Map Water';
        this.unit = 'm³/m²';
        this.iconURL = '../../../assets/img/overview/water.png';
        break;
    }
    this.dataServiceConfig.getJson(`image-map/${this.type}/${this.building}`).subscribe( res => {
      this.datasourse = res;
      this.datasourse.imageUrl = this.imageGenerator(this.type, this.datasourse.imageUrl);
      const forkRequests = {};
      this.disableLoading = false;
      for (const building of res.map) {
        if (building.building !== '' && building.building !== undefined) {
          forkRequests[building.building] = this.dataService.get(this.configs.endPoints['building-type-consumption'],
          {
            startDate: this.datePipe.transform(this.dateRange.start, 'yyyy/MM/dd'),
            endDate: this.datePipe.transform(this.dateRange.end, 'yyyy/MM/dd'),
            serviceTypeId: this.type === 'electricity' ? 1 : 2,
            dataMode: 1,
            interval: 0,
            buildingId: building.building
          });
        }
      }
      forkJoin(forkRequests).subscribe(value => {
        this.buildingsResponses = value;
      });
    },
    error => {
      this.router.navigate(['']);
    });
  }

  dateRangedChanged() {
    this.getBuildingMap();
  }

  mouseEnter(event: any) {
    event.target.style.fill = 'rgba(255,255,255, 0.4)';
    event.target.style.stroke = 'red';
    if (this.building !== 'main-map') {
      if (event.target.getAttribute('alt') !== 'null') {
        this.cardDetails = null;
        this.buildingName = event.target.getAttribute('alt');
        this.detailCard.nativeElement.style.display = 'flex';
        this.detailCard.nativeElement.style.top = (event.pageY - 100) - scrolTop + 'px';
        this.detailCard.nativeElement.style.left = event.pageX - 100 + 'px';
        const building = event.target.getAttribute('id');
        if (this.buildingsResponses) {
          if (this.buildingsResponses[building]) {
            if (this.buildingsResponses[building][0]) {
              const { suffix, scalledNumber } = abbreviateNumber(this.buildingsResponses[building][0].data[0].value, undefined );
              this.suffix = suffix;
              this.cardDetails = scalledNumber  // this.thousandSeparator.transform(fixDecimalNumPrecision(this.buildingsResponses[building][0].data[0].value, this.configs.siteConfigurations.decimalNumPrecision));
            } else {
              this.cardDetails = null;
              this.disableLoading = true;
            }
          }
        } else {
          this.cardDetails = null;
          this.disableLoading = true;
        }
      }
    } else {
      this.cardDetails = null;
      this.disableLoading = true;
      this.buildingName = event.target.getAttribute('alt');
      this.zoneCard.nativeElement.style.display = 'flex';
      this.zoneCard.nativeElement.style.top = (event.pageY - 100) - scrolTop + 'px';
      this.zoneCard.nativeElement.style.left = event.pageX - 100 + 'px';
    }
  }

  onClicked(event: any) {
    event.preventDefault();
    if (event.target.getAttribute('href') !== '#') {
      const url = ['/map/' + this.type + '/' + event.target.getAttribute('href')];
      this.router.navigate(url);
      this.detailCard.nativeElement.style.display = 'none';
      this.zoneCard.nativeElement.style.display = 'none';
    }
  }

  mouseOut(event: any) {
    event.target.style.fill = 'transparent';
    event.target.style.stroke = 'transparent';
    this.cardHide();
  }

  cardHide(){
    this.zoneCard.nativeElement.style.display = 'none';
    this.detailCard.nativeElement.style.display = 'none';
  }

  getPoints(p) {
    return p.toString();
  }

  imageDimension(event){
    this.imageHeight = event.currentTarget.offsetHeight;
    this.imageWidth = event.currentTarget.offsetWidth;
  }

  onPnaImage(event){
    this.cardHide();
  }

  getData(){
    const arr = [];
    const svg:any = document.querySelectorAll('.draggable');
    for (let i = 0; i < svg.length; i++) {
      const el = svg[i];
      arr.push({
        x: el.getAttribute("x"),
        y: el.getAttribute("y"),
        label: el.getAttribute("label"),
      })
    }
    this._tempMapCoordinate = null;
    
  }
  exectMap = () => {
    this.markingmap();
    const polyline = document.querySelector('#polyline');
    const svg:any = document.querySelector('#xxx');
    const arr = [];
    var selectedElement: any = false;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);
    function startDrag(evt) {
      if (evt.target.classList.contains('draggable')) {
        this.readyCall = false;
        const e: any = evt.target;
        selectedElement = e;
        const {x, y} = getMousePosition(evt);
        e.setAttribute('y', y)
        e.setAttribute('x', x)
      }
    }
    function drag(evt: any) {
      if (selectedElement) {
        evt.preventDefault();
        const e: any = evt.target;
        const {x, y} = getMousePosition(evt);
        e.setAttribute('y', y)
        e.setAttribute('x', x)
      }
    }
    function endDrag(evt: any) {
      selectedElement = null;
      setTimeout(() => this.readyCall = true, 1000)
    }

    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0]; }
      return {
        x: evt.offsetX - 15,
        y: evt.offsetY + 10,
      };
    }
  }
  readyCall: any = true;
  markingmap = () => {
    const polyline = document.querySelector('#polyline');
    const svg = document.querySelector('#xxx');
    const arr = [];
    svg.addEventListener('dblclick',(e: any) =>{
        let pts = polyline.getAttribute('points') || '';
        const newPoint = `${e.offsetX},${e.offsetY} `;
        const mapCoordinate = {x: e.offsetX, y: e.offsetY};
        pts = newPoint;
        polyline.setAttribute('points',pts);
        const newMap = callInput(mapCoordinate);
        if(this.readyCall){
          this.datasourse.zoneMap = [...this.datasourse.zoneMap, newMap];
        }
    })
    function callInput(mapCoordinate) {
      let person = prompt("Please enter label:", "");
      if (person == null || person == "") {
        return
      }
      return {
        ...mapCoordinate,
        label: person
      }
    }
  }

  _tempMapCoordinate = null;
  higlightMap () {
    const polyline = document.querySelector('#polyline');
    const svg = document.querySelector('#xxx');
    const arr = [];
    this._tempMapCoordinate = {};
    svg.addEventListener('click',(e: any) =>{
      if(this._tempMapCoordinate){
        let pts = polyline.getAttribute('points') || '';
        const newPoint = `${e.offsetX},${e.offsetY} `;
        pts += newPoint;
        polyline.setAttribute('points',pts); 
        this._tempMapCoordinate = {
          "alt": "untitled",
          "link": "#",
          "building": "450",
          "title": "untitled",
          "coords": pts
        }
      }
    })
  }
}
