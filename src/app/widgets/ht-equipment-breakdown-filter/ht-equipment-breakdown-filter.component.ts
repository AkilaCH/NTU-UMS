import { DateServiceService } from './../../services/date-service.service';
import { InitialService } from './../../services/initial.service';
import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { DateRange } from '../date-range-picker/public-api';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import uniqueBy from 'lodash/uniqBy';

@Component({
  selector: 'app-ht-equipment-breakdown-filter',
  templateUrl: './ht-equipment-breakdown-filter.component.html',
  styleUrls: ['./ht-equipment-breakdown-filter.component.scss']
})
export class HtEquipmentBreakdownFilterComponent implements OnInit {

  @Input() dataSource: any = [];
  @Input() dateRange: DateRange;
  @Input() isSite: boolean;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onDateRangeChanged: EventEmitter<any> = new EventEmitter();

  today: Date;
  @Input() loopId = 0;
  @Input() substationId = 0;
  @Input() meterId = 0;
  @Output() loopIdChange = new EventEmitter();
  @Output() substationIdChange = new EventEmitter();
  @Output() meterIdChange = new EventEmitter();
  loop = [];
  substation = [];
  meter = [];

  constructor(private config: InitialService, private dateService: DateServiceService) {
    if(this.config.getDemoConfig().isDemo) {
      this.today = new Date(this.config.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
    this.dateRange = this.dateService.thisMonthUpToNow(this.today);
  }

  ngOnChanges(changes: SimpleChanges) {
   try {
    this.loop = [];
    this.substation = [];
    this.meter = [];
    this.getLoopList();
    this.getSubstationsList();
    this.getMeterList();
    this.filterData();
   } catch (e) {}
  }

  ngOnInit() {
  }

  onEqBreakdownDateChange(event){
    this.onDateRangeChanged.emit(event);
  }

  getLoopList() {

    const allLoops = uniqueBy(this.dataSource, 'loopName');
    // tslint:disable-next-line: forin
    for (const item of allLoops) {
      // @ts-ignore
      this.loop.push({name: item.loopName, id: item.loopName});
      this.loop = orderBy(this.loop, ['name'], ['asc']);
    }
  }

  getMeterList() {
    const allMeters = uniqueBy(this.dataSource, 'meterName');
    // tslint:disable-next-line: forin
    for (const item of allMeters) {
      // @ts-ignore
      this.meter.push({name: item.meterName, id: item.meterName});
      this.meter = orderBy(this.meter, ['name'], ['asc']);
    }
  }

  getSubstationsList() {
    const allSubstations = uniqueBy(this.dataSource, 'substationName');
    // tslint:disable-next-line: forin
    for (const item of allSubstations) {
      // @ts-ignore
      this.substation.push({name: item.substationName, id: item.substationName});
      this.substation = orderBy(this.substation, ['name'], ['asc']);
    }
  }

  onLoopChange(event) {
    this.loopId = event.value;
    this.loopIdChange.emit(this.loopId);
    this.filterData();
  }

  onSubstationChange(event){
    this.substationId = event.value;
    this.substationIdChange.emit(this.substationId);
    this.filterData();
  }

  onMeterChange(event) {
    this.meterId = event.value;
    this.meterIdChange.emit(this.meterId);
    this.filterData();
  }

  filterData() {
    let filterdData = [...this.dataSource];
    if(this.loopId != 0) {
      filterdData = filter(filterdData, {loopName: this.loopId});
    }

    if (this.substationId != 0) {
      filterdData = filter(filterdData, {substationName: this.substationId});
    }

    if (this.meterId != 0) {
      filterdData = filter(filterdData, {meterName:  this.meterId});
    }

    this.onFilter.emit(filterdData);
  }

}
