import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-multi-series',
  templateUrl: './multi-series.component.html',
  styleUrls: ['./multi-series.component.scss'],
  host: {'class': 'w-100'}
})
export class MultiSeriesComponent implements OnInit {

  @Input() dataSource: any = {};
  @Input() height: number = 100;
  @Input() fixedWidth = false;

  chartWidth = new BehaviorSubject<any>('100%');

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    if (this.fixedWidth) {
      this.headerService.getChartWidth().subscribe(res => {
        this.chartWidth.next(res);
      });
    }
  }
}
