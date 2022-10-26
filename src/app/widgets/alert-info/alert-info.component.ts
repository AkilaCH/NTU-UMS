import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';
import { NotifierService } from 'angular-notifier';
import { HttpService } from 'src/app/services/http.service';
import { DatePipe } from '@angular/common';
import { InitialService } from 'src/app/services/initial.service';
import { DateRange } from '../date-range-picker/public-api';

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.scss']
})
export class AlertInfoComponent implements OnInit {

  unit: string;
  chartData: any = null;
  today: Date;
  chartDateRange: DateRange;
  @Input() alertInfo;
  private readonly notifier: NotifierService;

  constructor(
    private modalService: NgbModal,
    private activeModel: NgbActiveModal,
    private http: HttpService,
    private config: InitialService,
    private datePipe: DatePipe,
    ) { }

  ngOnInit() {
    this.chartDateRange = new DateRange();
    this.chartDateRange.start = new Date(this.alertInfo.data.selected[0].time);
    this.chartDateRange.end = new Date(this.alertInfo.data.selected[0].time);

    this.chartDateRange.start.setHours(this.chartDateRange.start.getHours() - 1);
    this.chartDateRange.end.setHours(this.chartDateRange.end.getHours() + 1);
    this.lodaChartData();

    switch (this.alertInfo.type) {
      case 'lt': case 'ht': case 'chiller':
        this.unit = 'kWh';
        break;
      case 'water':
        this.unit = 'm³';
        break;
    }
  }

  confirmAknowledge() {
    const modalRef = this.modalService.open(ConfirmationBoxComponent, { size: 'sm', centered: true});
    modalRef.componentInstance.massage = 'Do you want to Acknowledge this Alert?';
    modalRef.result.then((result) => {
      this.activeModel.close({ data: this.alertInfo.data.selected[0]});
    }, (reason) => {
    });
}

  lodaChartData() {
    this.http.get(this.config.endPoints['alert-chart-config'],{
      siteId: this.config.siteConfigurations.siteId,
      meterId: this.alertInfo.data.selected[0].equipmentId,
      from: this.datePipe.transform(this.chartDateRange.start, 'yyyy/MM/dd hh:mm a'),
      to: this.datePipe.transform(this.chartDateRange.end, 'yyyy/MM/dd hh:mm a')
    }).subscribe(res => {

      let chart = this.config.chartConfigurations['alert-popup-chart'];
      chart.plottooltext = `Time: $label<br/>Consumption: $value ${this.unit}`;

      this.chartData = {
        chart,
        data: res[0].data,
        trendlines: [
          {
            line: [
              {
                startvalue: this.alertInfo.data.selected[0].benchmarkValue,
                color: '#1aaf5d',
                displayvalue: 'BV',
                valueOnRight: '1',
                thickness: '2'
              }
            ]
          }
        ]
      };
    });
  }

}
