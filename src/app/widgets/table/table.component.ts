import { Component, OnInit, Input } from '@angular/core';
import { InitialService } from 'src/app/services/initial.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() tableData: any = {data: null, columns: []};
  @Input() isSite = false;

  constructor(private config: InitialService) {}

  getValue(data) {
    if(!isNaN(data)) {
      if(Number(data) === data && data % 1 === 0) {
        return data;
      } else if(data===null) {
        return 'N/A'
      } else {
        return data.toFixed(this.config.siteConfigurations.decimalNumPrecision);
      }
    } else {
      return data;
    }
  }

  ngOnInit() {}

}

