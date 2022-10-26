import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-grouped-trend',
  templateUrl: './grouped-trend.component.html',
  styleUrls: ['./grouped-trend.component.scss']
})
export class GroupedTrendComponent implements OnInit {
  @Input() dataSourse: any;
  @Input() height: number = 100;
  chartWidth: Observable<number>;
  chartHeight: string;

  constructor(private headerService: HeaderService) {
    this.chartWidth = headerService.getChartWidth();
    this.chartHeight = '100%';
  }

  ngOnInit() {
  }
}
