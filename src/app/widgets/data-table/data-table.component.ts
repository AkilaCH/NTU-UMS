import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { AlertSummaryFilterComponent } from '../alert-summary-filter/alert-summary-filter.component';
import { HeaderService } from 'src/app/services/header.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @ViewChildren('dataTable') dataTable: DatatableComponent;
  @Input() isLoading = false;
  @Input() rows = [];
  @Input() columns = [];
  @Input() clickable = false;
  @Output() onActionClicked = new EventEmitter();
  @Output() onRowClicked = new EventEmitter();
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  limit: number;
  selectedRows = [];
  tableWidth = new BehaviorSubject<any>('100%');

  rowLimits = [
    {id: 1, name: 10},
    {id: 2, name: 15},
    {id: 3, name: 25},
    {id: 4, name: 50},
    {id: 5, name: 100}
  ];

  constructor(private headerService: HeaderService) {
    this.limit = 15;
  }

  ngOnInit() {
    this.headerService.getChartWidth().subscribe(res => {
      this.tableWidth.next(res / this.columns.length);
    });
  }

  ngOnChanges() {
    this.rows = uniqWith(this.rows, isEqual);
  }

  changeNoOfRows(event) {
    const rowLimit = this.rowLimits.find(x => x.id == event.value);
    this.limit = rowLimit.name;
  }

  isActionColumn(key) {
    return key.includes('Action')
  }

  onActionButtonClicked(row, key) {
    this.onActionClicked.emit({key, data: row});
  }

  onRowClickedEvent(e) {
    this.onRowClicked.emit(e);
    this.selectedRows = [];
  }
}
