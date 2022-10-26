import { Component, OnInit, Input } from '@angular/core';
import { DateRange } from '../date-range-picker/public-api';

@Component({
  selector: 'app-dynamic-date-label',
  templateUrl: './meter-tree-date-view.component.html',
  styleUrls: ['./meter-tree-date-view.component.scss']
})
export class MeterTreeDateViewComponent implements OnInit {
  @Input() dateRange: DateRange  = new DateRange(new Date(), new Date());
  constructor() {
   }

  ngOnInit() {
  }

}
