import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { HeaderService } from 'src/app/services/header.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-alert-configuration-table',
  templateUrl: './alert-configuration-table.component.html',
  styleUrls: ['./alert-configuration-table.component.scss']
})
export class AlertConfigurationTableComponent implements OnInit {

  @Input() isLoading = false;
  @Input() dataSource;
  @Output() selectionChange = new EventEmitter();
  @Output() changeActive = new EventEmitter();

  ColumnMode = ColumnMode;
  limit: number;
  rowLimits = [
    {id: 1, name: 10},
    {id: 2, name: 15},
    {id: 3, name: 25},
    {id: 4, name: 50},
    {id: 5, name: 100}
  ];

  buildings: any = [];
  buildingGroups: any = [];
  levels: any = [];
  substations: any = [];
  loops: any = [];
  plants: any = [];
  tableWidth = new BehaviorSubject<any>('100%');

  constructor(private headerService: HeaderService) {
    this.limit = 15;
  }

  ngOnChanges() { }

  ngOnInit() {
    this.headerService.getChartWidth().subscribe(res => {
      this.tableWidth.next(res / 10);
    });
  }

  selectButtonClick(row, key) {
    row.changeMode.forEach(element => {
      element.selected = false;
    });
    row.changeMode.find(x => x.key == key).selected = true;
    this.selectionChange.emit({row, key});
  }

  changeNoOfRows(event) {
    const rowLimit = this.rowLimits.find(x => x.id == event.value);
    this.limit = rowLimit.name;
  }

  onToggle(event, meterID, row) {
    row.toggle = !row.toggle
    this.changeActive.emit({event, meterID});
  }
}
